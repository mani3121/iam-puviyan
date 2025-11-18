import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface UserNotification {
  id?: string;
  appType?: string;
  email: string;
  dateTime?: string;
  [key: string]: any;
}

const COLLECTION_NAME = 'user_notifications';

export const notificationService = {
  async create(data: Omit<UserNotification, 'id'>): Promise<string> {
    const ref = await addDoc(collection(db, COLLECTION_NAME), data);
    return ref.id;
  },

  async getById(id: string): Promise<UserNotification | null> {
    const ref = doc(db, COLLECTION_NAME, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<UserNotification, 'id'>) } as UserNotification;
  },

  async getAll(): Promise<UserNotification[]> {
    const snap = await getDocs(collection(db, COLLECTION_NAME));
    return snap.docs.map((d): UserNotification => {
      const data = d.data() as Omit<UserNotification, 'id'>;
      return { id: d.id, ...data } as UserNotification;
    });
  },

  async getByEmail(email: string): Promise<UserNotification[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('email', '==', email.trim())
    );
    const snap = await getDocs(q);
    return snap.docs.map((d): UserNotification => {
      const data = d.data() as Omit<UserNotification, 'id'>;
      return { id: d.id, ...data } as UserNotification;
    });
  },

  async update(id: string, data: Partial<Omit<UserNotification, 'id'>>): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, id);
    await updateDoc(ref, data);
  },

  async delete(id: string): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, id);
    await deleteDoc(ref);
  },
};
