<template>
    <v-image :config="imgConfig"/>
</template>
<script lang="ts" setup>
import { ref,  toRefs, watch } from 'vue'
import { 경기, 강원, 경남, 경북, 광주, 대구, 대전, 부산, 서울, 세종, 울산, 인천, 전남, 전북, 제주, 충남, 충북 } from '@/assets/images/regionSVG/mapImageSvg'

export interface Props {
    x: number // 좌표 x
    y:number // 좌표 y 
    airLevel:  string | 'default' | 'level1' | 'level2' | 'level3' | 'level4' // 공기질 레밸 
    regionName: string | '경기' | '강원' | '경남' | '경북' | '광주' | '대구' | '대전' | '부산' | '서울' | '세종' | '울산' | '인천' | '전남' | '전북' | '제주' | '충남' | '충북'
}

const props = defineProps<Props>()
const { x, y, airLevel, regionName } = toRefs(props)

// SVG 문자열 선택 
const getRegionSvg = (region:string) => {
    let svg = ''
    switch(region){
        case '경기':
        svg = 경기
        break
        case '강원':
        svg = 강원
        break
        case '경남':
        svg = 경남
        break
        case '경북':
        svg = 경북
        break
        case '광주':
        svg = 광주
        break
        case '대구':
        svg = 대구
        break
        case '대전':
        svg = 대전
        break
        case '부산':
        svg = 부산
        break
        case '서울':
        svg = 서울
        break
        case '세종':
        svg = 세종
        break
        case '울산':
        svg = 울산
        break
        case '인천':
        svg = 인천
        break
        case '전남':
        svg = 전남
        break
        case '전북':
        svg = 전북
        break
        case '제주':
        svg = 제주
        break
        case '충남':
        svg = 충남
        break
        case '충북':
        svg = 충북
        break

    }
    return svg
}
// 각 공기질 레벨 색상 
const ColorLevel = {
    level1: '#4ca5d79a',
    level2: '#56ba649a',
    level3: '#f19c4d9a',
    level4: '#f960609a',
    default: 'transparent'
} as const

// svg string을 이미지 url로 만든다
const getRegionImgObject = (svgStr:string, airLevel: string, imageObj:any) => {
    const regionUrl = URL.createObjectURL(new Blob([svgStr.replace('none', ColorLevel[airLevel as keyof typeof ColorLevel])], { type : 'image/svg+xml'}))
    imageObj.src = regionUrl
    return imageObj
}

const imgObj = new Image()
const imgConfig = ref({
    x: x.value,
    y: y.value,
    image: getRegionImgObject(getRegionSvg(regionName.value), airLevel.value, imgObj)
})

// 공기질 레벨이 변경되면  해당 지역 이미지 변경 
watch(airLevel, ()=>{
    imgConfig.value.image = getRegionImgObject(getRegionSvg(regionName.value), airLevel.value, imgObj)
})


</script>
<style lang="scss" scoped>

</style>
