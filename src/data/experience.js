// Tahun mulai berkecimpung di dunia IT (masuk SMK TKJ).
// Lama pengalaman dihitung otomatis supaya selalu update tiap tahun.
export const CAREER_START_YEAR = 2011

export const yearsOfExperience = (now = new Date()) => now.getFullYear() - CAREER_START_YEAR
