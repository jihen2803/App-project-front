export interface Review {
  id: number;
  rating: number;
  comment?: string;
  approved: boolean;
  authorName: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRequest {
  rating: number;
  comment?: string;
}
