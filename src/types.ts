// src/types.ts
export interface PredictionRow {
    id: number;               // DataGrid 要求有唯一 id 字段
    month: string;            // e.g. "2026-01"
    town: string;             // e.g. "YISHUN"
    flat_type: string;        // e.g. "5 ROOM"
    flat_model: string;       // e.g. "Simplified"
    floor_area_sqm: number;   // e.g. 128.9
    storey_median: number;    // e.g. 7
    flat_age: number;         // e.g. 44
    prediction: number;       // e.g. 1059562.50
  }
  