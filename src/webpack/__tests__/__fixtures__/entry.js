import mini from 'minimatch';
import sum from './sum';
import sub from './sub';

export default function entry(a, b) {
  reduce();
  return sum(a, b) + sub(a, b);
}
