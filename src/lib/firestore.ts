import { initializeApp, getApps } from 'firebase/app';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig';
import { generateTimeSlots, minutesToTimeString, monthRange } from './time';

export type Slot = {
  id: string;
  date: string;
  time: string;
  isOpen: boolean;
  bookedBy: string | null;
};

export type Booking = {
  id: string;
  slotId: string;
  facilityName: string;
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

export const buildSlotId = (date: string, time: string) => `${date}_${time}`;

export const ensureSlotsForDate = async (date: string) => {
  const slotsCollection = collection(db, 'slots');
  const slots = generateTimeSlots();
  await Promise.all(
    slots.map(async (slot) => {
      const time = minutesToTimeString(slot.minutes);
      const slotId = buildSlotId(date, time);
      const slotRef = doc(slotsCollection, slotId);
      const slotSnap = await getDoc(slotRef);
      if (!slotSnap.exists()) {
        await setDoc(slotRef, {
          id: slotId,
          date,
          time,
          isOpen: false,
          bookedBy: null
        });
      }
    })
  );
};

export const fetchSlotsByDate = async (date: string): Promise<Slot[]> => {
  const slotsCollection = collection(db, 'slots');
  const slotsQuery = query(slotsCollection, where('date', '==', date), orderBy('time', 'asc'));
  const snapshot = await getDocs(slotsQuery);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as Omit<Slot, 'id'>)
  }));
};

export const fetchOpenDaysInMonth = async (year: number, month: number) => {
  const { start, end } = monthRange(year, month);
  const slotsCollection = collection(db, 'slots');
  const slotsQuery = query(
    slotsCollection,
    where('date', '>=', start),
    where('date', '<=', end),
    where('isOpen', '==', true)
  );
  const snapshot = await getDocs(slotsQuery);
  const openDays = new Set<string>();
  snapshot.forEach((docSnap) => {
    const data = docSnap.data() as Slot;
    openDays.add(data.date);
  });
  return openDays;
};

export const updateSlotOpenState = async (date: string, time: string, isOpen: boolean) => {
  const slotId = buildSlotId(date, time);
  const slotRef = doc(db, 'slots', slotId);
  const slotSnap = await getDoc(slotRef);
  if (!slotSnap.exists()) {
    await setDoc(slotRef, {
      id: slotId,
      date,
      time,
      isOpen,
      bookedBy: null
    });
  } else {
    await updateDoc(slotRef, { isOpen });
  }
};

export const fetchBookingsForDate = async (date: string): Promise<Booking[]> => {
  const slots = await fetchSlotsByDate(date);
  const bookingIds = slots.map((slot) => slot.bookedBy).filter((id): id is string => Boolean(id));
  const bookings = await Promise.all(
    bookingIds.map(async (bookingId) => {
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingSnap = await getDoc(bookingRef);
      if (!bookingSnap.exists()) {
        return null;
      }
      const data = bookingSnap.data() as Omit<Booking, 'id'>;
      return { id: bookingSnap.id, ...data };
    })
  );
  return bookings.filter((booking): booking is Booking => booking !== null);
};

export type BookingErrorCode = 'closed' | 'filled';

export const bookSlotWithTransaction = async (params: {
  date: string;
  time: string;
  facilityName: string;
}) => {
  const { date, time, facilityName } = params;
  const slotId = buildSlotId(date, time);
  const slotRef = doc(db, 'slots', slotId);
  const bookingRef = doc(collection(db, 'bookings'));

  return runTransaction(db, async (transaction) => {
    const slotSnap = await transaction.get(slotRef);
    if (!slotSnap.exists()) {
      throw new Error('closed');
    }
    const slot = slotSnap.data() as Slot;
    if (!slot.isOpen) {
      throw new Error('closed');
    }
    if (slot.bookedBy) {
      throw new Error('filled');
    }

    transaction.update(slotRef, { bookedBy: bookingRef.id });
    transaction.set(bookingRef, {
      slotId,
      facilityName,
      createdAt: serverTimestamp()
    });

    return bookingRef.id;
  });
};
