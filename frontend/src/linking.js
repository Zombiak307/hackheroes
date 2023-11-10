const config = {
    screens: {
      Login: {
        path: 'login/:params',
        parse: {
          name: params => `${params}`,
        },
      },
    },
  };
  
  const linking = {
    prefixes: ['hackheroes://app'],
    config,
  };
  
export default linking;