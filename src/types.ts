export interface ArtMovementInfo {
  id: string;
  name: string;
  label: string;
  era: string;
  periodYears: string;
  keyArtists: string[];
  characteristics: string[];
  techniques: string[];
  description: string;
  paletteColors: string[];
}

export interface PredictionProb {
  movement: string;
  label: string;
  probability: number;
  percentage: number;
}

export interface PredictionResponse {
  predominant_movement: string;
  predominant_label: string;
  confidence: number;
  top_predictions: PredictionProb[];
  gradcam_image_base64?: string;
  inference_time_ms: number;
  image_source: string;
  source_type: 'upload' | 'url' | 'sample';
  gradcam_explanation?: string;
}

export interface SampleArtwork {
  id: string;
  title: string;
  artists: string;
  year: string;
  movementId: string;
  movementLabel: string;
  imageUrl: string;
  description: string;
  institution?: string;
}

export interface ServerConfig {
  baseUrl: string;
  isConnected: boolean;
  isChecking: boolean;
  lastChecked?: Date;
  modelStatus?: string;
}
