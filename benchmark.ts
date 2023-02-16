let time = 0;
export const benchmark = {
  start_point: () => {
    time = Date.now();
  },
  end_point: () => {
    return (Date.now() - time) / 1000;
  },
};
