import url from './URL'

export function flatternProuducts(data) {
  return data.map(item=> {
    //claudinary
//    let image = item.image.url;

    //local
    let image = `${url}${item.image[0].url}`;
    return {...item,image};
  });
}

// helper functions
export function featuredProducts(data) {
  return data.filter(item => {
    return item.featured === true;
  });
}