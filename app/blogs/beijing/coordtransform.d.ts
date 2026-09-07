declare module "coordtransform" {
  const transform: {
    gcj02towgs84(lng: number, lat: number): [number, number];
    bd09togcj02(lng: number, lat: number): [number, number];
  };
  export default transform;
}
