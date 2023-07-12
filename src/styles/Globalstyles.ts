import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
    * {
        font-family: 'Noto Sans KR', sans-serif;
        box-sizing: border-box;
    }

    body {
        background-color: #FFF;
        margin: 0px;
        min-width: 1600px;
        max-width: 100%;
    }
`

export default GlobalStyle
