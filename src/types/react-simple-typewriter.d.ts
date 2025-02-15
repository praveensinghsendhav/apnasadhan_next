declare module 'react-simple-typewriter' {
  export const Typewriter: React.FC<{
    words: string[];
    loop?: number;
    cursor?: boolean;
    cursorStyle?: string;
    typeSpeed?: number;
    deleteSpeed?: number;
    delaySpeed?: number;
  }>;
} 