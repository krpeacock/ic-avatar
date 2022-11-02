declare module "*.svg" {
  const value: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default value;
}

declare module "*.webp" {
  const value: string;
  export default value;
}
