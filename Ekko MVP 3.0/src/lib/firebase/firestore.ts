import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';

export const updateEntrepreneurPaymentLinks = async (entrepreneurId: string, nequiLink: string, bancoLink: string) => {
  const entrepreneurRef = doc(db, 'entrepreneurs', entrepreneurId);
  try {
    await updateDoc(entrepreneurRef, {
      nequiLink: nequiLink || null,
      bancoLink: bancoLink || null,
    });
    console.log('Payment links updated successfully!');
  } catch (error) {
    console.error('Error updating payment links: ', error);
    throw new Error('Failed to update payment links.');
  }
};
