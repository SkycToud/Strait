import { ClubDetail } from '@/types/club';
import { db } from '@/lib/firebase-admin';

export async function getClubById(id: string): Promise<ClubDetail | undefined> {
  try {
    const doc = await db.collection('clubs').doc(id).get();
    if (!doc.exists) {
      return undefined;
    }
    return doc.data() as ClubDetail;
  } catch (error) {
    console.error(`Error fetching club ${id}:`, error);
    return undefined;
  }
}

export async function getAllClubs(): Promise<ClubDetail[]> {
  try {
    const snapshot = await db.collection('clubs').get();
    const clubs = snapshot.docs.map(doc => doc.data() as ClubDetail);
    return clubs;
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return [];
  }
}

export async function getClubsByCategory(): Promise<ClubDetail[]> {
  return getAllClubs();
}

export async function getRecentlyUpdatedClubs(days: number = 30, limit?: number): Promise<ClubDetail[]> {
  try {
    const allClubs = await getAllClubs();
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const recentClubs = allClubs
      .filter(club => {
        if (!club.lastUpdated) return false;
        const updatedDate = new Date(club.lastUpdated);
        return updatedDate >= cutoffDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.lastUpdated || '1970-01-01');
        const dateB = new Date(b.lastUpdated || '1970-01-01');
        return dateB.getTime() - dateA.getTime();
      });

    return limit ? recentClubs.slice(0, limit) : recentClubs;
  } catch (error) {
    console.error('Error fetching recently updated clubs:', error);
    return [];
  }
}
