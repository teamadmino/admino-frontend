export interface KeyboardLayout {
  columns: KeyboardColumn[];
}
export interface KeyboardColumn {
  rows: KeyboardRow[];
}

export interface KeyboardRow {
  keys: KeyboardKey[];
  height?: number;

}


export interface KeyboardKey {
  label?: string;
  character: string | number;
  width?: number;
  disabled?: boolean;
  labelSize?: number;
}
