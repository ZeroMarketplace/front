const RelatedSlider = {
    snapAlign: "start",
    itemsToShow: 4,
    itemsToScroll: 1,
    autoplay: false,
    transition: 600,
    wrapAround: true
  };
  const RelatedSliderBreakpoints = {
    300: { itemsToShow: 1 },
    600: { itemsToShow: 2 },
    767: { itemsToShow: 2 },
    991: { itemsToShow: 3 },
    1024: { itemsToShow: 3 },
    1500: { itemsToShow: 4 },
  };

  
export {
   RelatedSlider,
   RelatedSliderBreakpoints
}