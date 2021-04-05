export interface Library {
  id: number;
  path: string;
  active: boolean;
}

export interface LibraryNoPath {
  id: number;
  active: boolean;
}

export const NullLibrary: Library = {
  id: -1,
  path: '',
  active: false,
};
