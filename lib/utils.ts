import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYearsOfExperience() {
  const startDate = new Date('2021-11-01');
  const today = new Date();
  
  let years = today.getFullYear() - startDate.getFullYear();
  let months = today.getMonth() - startDate.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  // Format as Years.Months (e.g., 4.10 for 4 years 10 months)
  return `${years}.${months}`;
}
