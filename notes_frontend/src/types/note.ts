/**
 * Note domain model definition shared across app.
 */

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
};
