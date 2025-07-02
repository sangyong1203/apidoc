export default {
    plugins: {
      'postcss-pxtorem': {
        rootValue: 16, // 1rem = 16px，
        unitPrecision: 5, // 소수점 정확도
        propList: ['*'], // 모든 css 속성 
        // selectorBlackList: ['tui-grid','tui-grid-btn-sorting','tui-grid-btn-sorting-up', 'tui-grid-btn-sorting-down'], // 전환하지 않는 속성
        selectorBlackList: ['tui-grid'], // 전환하지 않는 속성
        replace: true, // 원 값을 바꾸는지
        mediaQuery: true, // media query에서도 전환하는지
        minPixelValue: 0 // 이 값보다 작거나 같을때 전환
      }
    }
  };