import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styled from "styled-components";
import { theme } from "../../../../styles/theme";
import Button from "../../../../styles/assets/Button";
import { Container, Div, FlexDiv } from "../../../../styles/assets/Div";
import { TextInput } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";

import DragNDrop from "../../../Common/DragNDrop";
import TextEditor from "../../../Common/TextEditor";
import Loading from "../../../Common/Loading";

import useFetch from "../../../../Hooks/useFetch";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";

import { selectedFile, menuId, refetch } from "../../../../Recoil/frontState";
import { fileIdList } from "../../../../Recoil/backState";


const TitleTextInput = styled(TextInput)`
    border-radius: 5px;
    font-size: 25px;

    &::placeholder {
        color: ${(props) => props.theme.color.grey1};
    }
`;

export interface activityDetailInterface {
    id: string;
    title: string;
    content: string;
    writerName: string;
    dateCreated: string;
    dateUpdated: string;
    images: {
            id: string;
            name: string;
            url: string;
            size: number;
            type: string;
    }[];
}

const ActivityCreate = () => {
    const navigate = useNavigate();
    const paramID = useParams().id;
    const inputRef = useRef<any[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [postData, postFetchData] = useFetch();
    const [getData, getFetchData] = useFetch();
    const setSelectedFile = useSetRecoilState(selectedFile);
    const [fileId, setFileList] = useRecoilState(fileIdList);
    const [files, setFiles] = useRecoilState(selectedFile);
    const [detail, setDetail] = useState<activityDetailInterface | null>(null);
    const currentMenuId = useRecoilValue(menuId);
    const setReload = useSetRecoilState(refetch);

    const [update, setUpdate] = useState("create");

    const sendInput = () => {
        if (inputRef.current[0].value === "") {
            alert('제목을 입력해주세요');
            return
        }
        if (inputRef.current[1].getInstance().getMarkdown().trim() === "") {
            alert('네용을 입력해주세요');
            return
        }

        const inputData = {
            title: inputRef.current[0].value,
            content: inputRef.current[1].getInstance().getMarkdown(),
            files: fileId,
        }

        const formdata = new FormData();

        for (let i = 0; i < files.length; i++) {
            formdata.append("files", files[i]);
        }

        console.log(inputData)
        if (update === 'update') {
            console.log(inputData)
            postFetchData(`/club/activity/${paramID}`, "POST", "token", inputData);
        } else {
            postFetchData(`/club/activity`, "POST", "token", inputData);
        }
    }

    useEffect(() => {
        if (paramID) {
            setUpdate("update");
        } else {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (update === "update") {
            getFetchData(`/club/activity/${paramID}`, "GET", "token");
        }
    }, [update]);

    useEffect(() => {
        if (postData) {
            if (update === 'update') {
                alert("글이 정상적으로 수정되었습니다");
            } else {
                alert("글이 정상적으로 등록되었습니다");
            }
            navigate(`/activity`);
        }
    }, [postData]);

    useEffect(() => {
        if (getData) {
            setDetail(getData);
            console.log(detail)
            setIsLoading(false);
            
            // DragNDrop update 설정
            const files = [
                ...getData.images.map((item: activityDetailInterface|null) => item),
                ...getData.otherFiles.map((item: activityDetailInterface|null) => item),
            ];
            setSelectedFile(files);
            const fileIds = [
                ...getData.images.map((item: activityDetailInterface|null) => item?.id),
                ...getData.otherFiles.map((item: activityDetailInterface|null) => item?.id),
            ];
            setFileList(fileIds);
            setReload(true);
        }
        return () => {
            setDetail(null);
            // DragNDrop fileList 초기화
            setFileList([]);
        };
    }, [getData]);


    return (
        <FlexDiv width="100%" $border={`1px solid ${theme.color.grey1}`}>
            {isLoading ? (
                <Loading />
            ) : (
                <Container>
                    <Div width="100%">
                        <Div $border="1px solid" $borderColor="border" radius={5} width="100%">
                            <Div $borderB={`1px solid ${theme.color.border}`} $padding="20px" width="100%">
                                {update === "update" ? 
                                    (<P fontWeight={600}>게시글 수정</P>) :
                                    (<P fontWeight={600}>게시글 작성</P>)
                                }
                            </Div>
                            <Div width="100%" $padding="20px">
                                <Div width="100%">
                                    <TitleTextInput
                                        width="100%"
                                        height="70px"
                                        placeholder="제목을 입력해주세요"
                                        ref={(el: never) => (inputRef.current[0] = el)}
                                        defaultValue={detail?.title}
                                    />
                                </Div>

                                <DragNDrop fileFetch menuId={currentMenuId} />
                            </Div>
                            <Div width="100%" $padding="20px">
                                <TextEditor 
                                    ref={(el: never) => (inputRef.current[1] = el)}
                                    initialContent={detail?.content}
                                />
                            </Div>
                        </Div>

                        <FlexDiv width="100%" $margin="30px 0 0 0">
                            <Button
                                $backgroundColor="bgColor"
                                $HBackgroundColor="bgColorHo"
                                $borderRadius={2}
                                $padding="15px 30px"
                                width="400px"
                                onClick={sendInput}
                            >
                                {update === "update" ? 
                                    (<P color="wh">수정하기</P>) :
                                    (<P color="wh">작성하기</P>)
                                }
                            </Button>
                        </FlexDiv>
                    </Div>
                </Container>
            )}
        </FlexDiv>
    );
};

export default ActivityCreate;