import sum from './sum';
import sub from './sub';

export default function entry(a, b) {
  return sum(a, b) + sub(a, b);
}
