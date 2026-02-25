export type Watch = { id: string; name: string; short: string };

export const WATCHES: Watch[] = [
  { id: "mido-baroncelli-heritage", name: "미도 바론첼리 헤리티지", short: "바론첼리" },
  { id: "gshock-gw-m5610u-1", name: "지샥 GW-M5610U-1", short: "빨테" },
  { id: "hamilton-khaki-navy-scuba", name: "해밀턴 카키네이비 스쿠바", short: "카키네이비" },
  { id: "militado-ml10", name: "밀리타도 ML10", short: "ML10" },
  { id: "hamilton-khaki-field-expedition", name: "해밀턴 카키필드 익스페디션", short: "카키익스" },
  { id: "seiko-ssb479", name: "세이코 SSB479", short: "SSB479" },
  { id: "tagheuer-monaco-gulf", name: "태그호이어 모나코 걸프", short: "모나코" },
];

export const watchById = (id: string | undefined) =>
  WATCHES.find(w => w.id === id);