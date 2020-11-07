declare module 'ansi-diff-stream' {
  export default function differ(): {
    pipe: (stdout: NodeJS.WriteStream) => void;
    clear: () => void;
    write: (output: string) => void;
  };
}
