# Postapi

API 테스트, 문서 자동 작성을 위한 시스템입니다.

## 개발 환경

- Node.js. (v20.17.0 이상 버전을 설치하여 사용하세요.)
- [Node.js 다운로드](https://nodejs.org/en/download)  <- 클릭하여 다운로드 페이지로 이동

## 주요 기술스택
- Vue 3
- Pinia
- Vite
- Element Plus
- SCSS
- Html2canvas
- Echarts
- Day.js
- Tui-grid
- Vue Konva
- TypeScript

## 설치 및 실행 명령어
```
    git clone https://github.com/sangyong1203/apidoc.git
    cd postapi
    npm install
    npm run dev

    npm run type-check // 타입체크 명령어 
    npm run build

    //--to publish
    npm publish
```

---

## 폴더 설명

**주요 폴더만 간략히 설명**

| 폴더명              | 설명      | 파일 명명 규칙          | 예제          |
|:-----------------|:-----------------------------------------------------|:-------------------------------------------------|----------------------------------:|
| `assets`         | font, images, icons, css, language 소스 파일 모음. 시스템 컬러 양식 등을 조절하려면 main.css파일에 root에서 설정. language는 다국어 언어파일 모음.  | `kabab-case`| `font.css` |
| `common`         | axios, utils, dialog, xlsx 등 공통으로 재사용 하기 위한 파일 모음. |     |      |
| `common/dialog`  | useGlobleDialog, Message, Notification 컴포넌트 모음. | `PascalCase` | `CommonDialog.ts` |
| `common/modules` | axios, auth_token, web_socket 등 통신을 위한 파일 모음. | `PascalCase` |  `index.ts`, `WebSocketClient.ts` |
| `common/types`   | 프로젝트 내에서 공통으로 사용하는 타입들을 정의한 파일 모음. | `PascalCase` | `Common.ts` |
| `common/utils`   | 프로젝트 내에서 공통으로 사용하는 함수들을 정의한 파일 모음. | `PascalCase`| `ComUtil.ts`|
| `common/service` | 프로젝트 내에서 공통으로 사용하는 드롭다운 리스트에 필요하는 데이터 호출 API 함수 모음. | `PascalCase`| `ComService.ts`|
| `common/xlsx`    | 엑셀폼을 작성하고 다운로드하는 기능에 필요하는 module 파일.  |               |                 |
| `components`     | UI 공통 컴포넌트 파일 모음. index.ts파일은 UI컴포넌트를 export 하는 파일. | `PascalCase` |  `CommonLayout.vue` |
| `pages`          | 실제 화면으로 보여질 vue 파일과 데이터를 위한 model_service 모음. main 폴더 안에 페이지 폴더는 메뉴별로 구성 되였음. model_service에 Type.ts파일은 데이터 타입 정의. service.ts는 API호출 및 메소드 로직을 정의. SelfApi.ts는 API를 정의.  | `PascalCase`, `소문자` | `UserInfo.vue`, `index.vue` |
| `router`         | 라우터와 관련된 파일 모음. 경로는 routes.ts파일에 작성하고 index.ts파일에는 라우터 가드를 작성. | `소문자` | `routes.ts` |
| `stores`         | 전역으로 접근가능한 상태(데이터)들을 관리하기 위한 파일 모음 | `PascalCase` | `NavStore.ts` |


---


## 코딩 가이드 

### 명명 규칙 

1. 폴더
- 폴더는 '소문자'로만 작성하여 생성한다. (예: common )
- 단어가 2단어 이상일 경우 단어의 `camelCase`로 작성한다.

2. 파일명
- 파일은  `PascalCase` 형태로 작성하여 생성한다. (예: AppVersion )
- index.ts 파일은 소문자 

3. class
- class는 `PascalCase` 형태로 작성하여 생성한다. (예: UserService)

4. type (typescript에 type)
- type 명은 '파스칼 케이스'형태 및 '소문자'로 작성하여 생성한다. (예: UserInfo)
- type.ts 안에 선언하는 type은 'type' 으로 선언한다. 예:

```ts
    // 예시:
    export type UserInfo = {
        userId: string
        userName: string
        age: string
    }
```

5. 상수
- 상수는 변수명, 키값 모두 `SNAKE_CASE`(대문자)로 작성한다.

```ts
    // 예시:
    export const AUTH_LEVEL = {
        MASTER: 1,
        ADMIN: 2,
        MANAGER: 3,
        MEMBER: 4,
    } as const
```

### model_service 작성 

#### Step1: Type.ts에 데이터 Type 정의 (가장 먼저 정의 할것 )

- 모든 타입은 `type` 키워드로 선언.

```ts
    // 예시:
    export type User = {
        name: string 
        age: number
    }
```

- type model 및 CRUD 데이터 타입 정의. type model에 모든 CRUD에 필요하는 데이터 타입을 선언 후 List, Item, CreateParams, UpdateParams, DeleteParams 타입을 `Pick` 사용하여 타입 정의 한다. 아래 예시코드에 `NoticeModel`이 type model이다. type model은 export 하지 않는다. 

```ts
    // 예시:
    type NoticeModel = {
        id: number 
        ids: number[] 
        title: string 
        createId: string
        createName: string 
        content: string 
        createDate: string 
    }
    export type List = Pick<NoticeModel, 'id' | 'title' | 'createId' | 'createName' | 'content' | 'createDate'>
    export type Item = Pick<NoticeModel, 'id' | 'title' | 'createId' | 'createName' | 'content' | 'createDate'>
    export type CreatePrams = Pick<NoticeModel, 'title' | 'content'>
    export type UpdatePrams = Pick<NoticeModel, 'id' | 'title' | 'content'>
    export type DeletePrams = Pick<NoticeModel, 'ids'>
``` 

- 2개 이상의 CRUD 세트인 경우, 각역할별로 구분하여 장명한다.  예: NoticeList, NoticeItem,  UserList, UserItem 등

#### Step2: SelfApi.ts 작성

- SelfApi.ts에는 service에서 호출할 api fetch함수만 작성한다. 함수의 params는 `(params: Params)`로만 작성한다. 
`payload`에 `query`는 조회할때, `body`는 등록수정삭제 할때 사용한다. 모든 return 값은 `Proomise<APIResponse>` 타입이다.

``` ts
    // 예시:
    import { fetch } from '@/common/modules/axios'
    import type { Params, PayloadModel } from '@/common/modules/axios/request'
    import { APIResponse } from '@/common/modules/axios/response'

    export default {
        // 목록 조회
        async getList(params: Params): Promise<APIResponse> {
            const payload: PayloadModel = { query: params }
            return await fetch().get('/api/setting/notice/list', { payload })
        },
        // 상세 조회
        async getInfo(params: Params): Promise<APIResponse> {
            const payload: PayloadModel = { query: params }
            return await fetch().get('/api/setting/notice', { payload })
        },
        // 등록 
        async create(params: Params): Promise<APIResponse> {
            const payload: PayloadModel = { body: params }
            return await fetch().post('/api/setting/notice', { payload })
        },
        // 수정 
        async update(params: Params): Promise<APIResponse> {
            const payload: PayloadModel = { body: params }
            return await fetch().put('/api/setting/notice', { payload })
        },
        // 삭제 
        async delete(params: Params): Promise<APIResponse> {
            const payload: PayloadModel = { body: params }
            return await fetch().delete('/api/setting/notice', { payload })
        },
    }
```

#### Step3: Service.ts 작성

- Service파일에는 페이지에 사용할 service 로직 함수, api호출 함수, 데이터 변수 등을 작성한다. Service파일에는 SelfApi.ts 작성한 함수와 Types.ts에 타입을 여기에 import해서 사용한다. getList, getInfo등 데이터조회 함수는 받아온 데이터를 class 속성 변수에 직접 할당한다. return 필요없다.  

```ts
    // 예시:
    import api from './SelfApi.ts'
    import type { List, Item, CreatePrams, UpdatePrams, SearchParams, DeletePrams } from './Type.ts'

    export class Service {
        totalRow= 0
        list:List[]= []
        item:Item = {
            id: 0, 
            title: '',
            createId: '',
            createName: '',
            content: '',
            createDate: '',
        }
        async getList(param: SearchParams): Promise<void> {
            const res = await api.getList(param)
            this.list = res.data.list??[]
            this.totalRow = res.data.totalRow
        }
        async getInfo(params:{id:number}): Promise<void> {
            const res = await api.getInfo(params)
            this.item = res.data
        }
        async create(params:CreatePrams): Promise<any> {
            return await api.create(params)
        }
        async delete(params:DeletePrams): Promise<any> {
            return await api.delete(params)
        }
    }
```


### vue파일 작성 

**vue파일 작성시 주의할점 간단 설명**

- Service instance를 생성할때는 꼭 reactive / ref를 사용해야 한다. 

```ts
    // 예시: 
    const obj = reactive(new Service()) // 화면 반영을 위해 
```

- BasicDialog 컴포넌트 사용하여 등록 및 수정 페이지를 작성할 경우 창을 닫을 때 init()를 구현하여 모든 값을 초기화해야 합니다. 이유: 창이 닫혀도 데이터가 유지되기 때문이다. 

- 페이지 내에서 페이지 이동은 useNavStore를 사용한다. 

- 페이지 KeepAlive 적용된 페이지에서는 onMounted가 아닌 onActivated 훅을 사용해야 페이지 이동시 훅 안의 함수가 제대로 작동한다.

```ts
    // 예시:
    onActivated(async () => {
        await getList()
    })
```

- 등록, 수정, 삭제 후에는 목록 데이터를 다시 호출하여 갱신해야 한다. 

- 등록일, 수정일등 날짜는  `ComUtil.dateFormat()`함수를 사용해서 사용하여 포맷한다. 직접 dayjs를 사용하면 null/undefined이슈가 발생할 수 있다.

```ts
    // 예시:
    ComUtil.dateFormat(form.createDate, 'YYYY-MM-DD HH:mm:ss')
```

- <OperationButton> 컴포넌트를 사용할 때 `:auth="navStore.getAuthAction()"`를 추가하여 해당 권한을 판단한다. 권한이 있을 경우 정상 작동하며, 없으면 작동하지 않으며 '권한이 없음' 노티가 나타난다.

```vue
    <!-- 예시:  -->
    <OperationButton type="수정" :auth="navStore.getAuthAction()" @click="toEdit" />
``` 

- <el-table> 컴포넌트에 checkbox 사용할 때 el-table 태그에 'muliple' 속성을 추가하면 다종 선택이 되고, 'multiple' 속성이 없으면 단일 선택만 가능한다. 

```vue
    <!-- 예시:  -->
    <el-table multiple></el-table>
```

- 모든 페이지는 기본적으로 `PageHeader`와 `PageBody` 컴포넌트를 사용하여 작성한다. 페이지 내용은 `PageBody` 컴포넌트 안에 작성한다.

```vue
    <!-- 예시:  -->
    <PageHeader title="사용자정보" description="사용자의정보를조회할수있습니다"></PageHeader>
    <PageBody></PageBody>
```

- 목록의 검색 조건은 <SearchBox> 컴포넌트를 사용한다. 기타 검색 조건을 아래 줄에 추가하려면, <SearchBox> 태그에 'extra' 속성을 추가하고 `<template #extra></template>` 안에 작성 한다.

```vue
    <!-- 예시:  -->
    <SearchBox :on-search="getList" extra>
        <SearchText :label="L.검색" v-model="searchParams.searchValue">
            <DropdownList
                width="140px"
                v-model="searchParams.searchKey"
                :placeholder="L.구분선택"
                :list="searchTypes"
                option-label="label"
                option-value="searchKey"
            />
        </SearchText>
        <template #extra>
            <DropdownList
                width="350px"
                :label="L.도특별광역시"
                v-model="searchParams.province"
                :placeholder="L.도특별광역시선택"
                :list="obj.provinceList"
                option-label="province"
                option-value="province"
                @onChange="selectProvince"
            />
        </template>
    </SearchBox>
```

---



## 전역 함수

### Dialog

- 전역에서 사용하는 팝업 다이얼로그로 '확인/취소', '예/아니요' 등 버튼을 제공한다.   

```ts
    // 예시: 
    import { useGlobalDialog } from 'src/common/dialog'

    useGlobalDialog('등록하시겠습니까?','노트','CONFIRM_YN')
    .onConfirm(()=>{
    // 확인/예 버튼 클릭시 do something
    })
    .onCancel(()=>{
    // 취소/아니오 버튼 클릭시 do something
    })
    .onClose(()=>{
    // 닫기 x 버튼 클릭시 do something
    })
```

### ComUtils

- 전역에서 공통으로 사용되는 함수들의 집합이다. 예: dateFormat, validation, phoneFormatter 등

```ts
    // 예시: 날짜 format 함수 
    ComUtil.dateFormat(form.createDate, 'YYYY-MM-DD HH:mm:ss')
```

### ComService

- 콤보박스나 선택 리스트에 사용되는 데이터를 호출하는 API함수는 `src/common/service`파일에 작성한다. 


### xlsx에 makeExcelAndDownload

- xlsx 폴더에 있는 makeExcelAndDownload함수는 엑셀 파일를 작성하고 다운로드한다. 상세 사용 방법은 'src/common/xlsx/index.ts'파일에서 확인할 수 있다.

```ts
    // 예시:
    import { makeExcelAndDownload } from '@/common/xlsx'
    makeExcelAndDownload(table, '사용자데이터', ['사용자', '이메일', '전화', '등록일', '수정일'], '에러코드엑셀파일')
```

---


## 라우터 

- 모든 라우터의 path는 `src/router/routes.ts`파일에 작성한다. 
- 라우터 가드(beforeEach, afterEach 등)는 'src/router/index.ts' 파일에 작성한다.


## Store에 대한 간단 설명 

- `MenuStore.ts`는 호출한 메뉴 데이터를 관리하며,  임시 로컬 데이터로 사용하는 `tempMenu`를 여기에 작성한다.
- `NavStore.ts`는 페이지 이동 시 사용하며, 메뉴 path,  페이지명, 페이지 이동 함수 `navTo()`, 뒤로가기 함수 `backTo()` 함수 등이 포함된다.
- `Progress.ts`는 파일 업로드 시 프로그래스 바를 사용할 때 사용한다. 프로그래스 완료 퍼센트 및 프로그래스 시작/종료 등을 관리한다. 
- `RequestDefence.ts`는 대량 요청 방지를 위한 기능을 제공한다.
- `LangStore.ts`는 다국어 언어 데이터를 저장하고 관리한다.
- `UserStore.ts`는 로그인 사용자 데이터를 저장하고 관리한다. 


## 기타 

- 다국어 관리는 메뉴 관리 페이지에 있다.
- public폴더에 langFile은 다국어 데이터를 로콜에서 호출할 때 필요한 excel파일이다. 
- 시스템 컬러 양식을 변경하려면 `src/assets/css/main.scss`파일의 `root`에서 컬러를 수정하면 된다.
- 서버 API가 아직 제공되지 않는 경우  `mockData.ts`를 생성해서 가상 데이터를 작성하고 임시 데이터로 사용하여 개발한다.


[⬆️ Back to the top](#ui-framework)