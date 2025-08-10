export interface MemeText {
  content: string;
  fontSize: number;
  color: string;
  stroke: string;
  strokeWidth: number;
  y: number;
}

export interface MemeTemplate {
  name: string;
  url: string;
}

export interface AIMemeResponse {
  imageUrl: string;
  topText: string;
  bottomText: string;
}