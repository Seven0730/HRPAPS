export interface PredictionRow {
  id: number;               // DataGrid id
  month: string;            // e.g. "2026-01"
  town: string;             // e.g. "YISHUN"
  flat_type: string;        // e.g. "5 ROOM"
  flat_model: string;       // e.g. "Simplified"
  floor_area_sqm: number;   // e.g. 128.9
  storey_median: number;    // e.g. 7
  flat_age: number;         // e.g. 44
  prediction: number;       // e.g. 1059562.50
}
export interface Prediction {
    month: string;        // e.g. "2026-01"
    town: string;         // e.g. "YISHUN"
    flat_type: string;    // e.g. "5 ROOM"
    flat_model: string;   // e.g. "Simplified"
    floor_area_sqm: number;
    storey_median: number;
    flat_age: number;
    prediction: number;
  }
  
  export interface ChartProps {
    data: Prediction[];
    /** optional filters */
    town?: string;
    flatType?: string;
  }
  
  export interface GbtRecord {
    month: string;             // 如 "2026-01"
    town: string;              // 如 "YISHUN"
    flat_type: string;         // 如 "5 ROOM"
    flat_model: string;        // 如 "Simplified"
    floor_area_sqm: number;    // 如 128.9
    storey_median: number;     // 如 7
    flat_age: number;          // 如 44
    prediction: number;        // 如 1059562.50
  }
export interface XgbRecord {
  year_month: string;         // e.g. "2025-05"
  town: string;              // e.g. "ANG MO KIO"
  resale_price: number;      // e.g. 609454.56
}

export interface Filters {
  dateFrom: string;          // "2025-01"
  dateTo: string;            // "2026-12"
  selectedTowns: string[];   // e.g. ["YISHUN", "BUKIT PANJANG"]
  selectedFlatTypes: string[];// e.g. ["3 ROOM","4 ROOM"]
  selectedModels: string[];  // e.g. ["Simplified","Standard"]
}