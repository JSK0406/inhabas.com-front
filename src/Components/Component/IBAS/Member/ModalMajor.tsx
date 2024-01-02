import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";

import { theme } from "../../../../styles/theme";

import useFetch from "../../../../Hooks/useFetch";

import { majorInfo } from "../../../../Recoil/backState";
import { majorSelected, modalOpen } from "../../../../Recoil/frontState";

import A from "../../../../styles/assets/A";
import Button from "../../../../styles/assets/Button";
import { Div, FlexDiv } from "../../../../styles/assets/Div";
import { H2 } from "../../../../styles/assets/H";
import Img from "../../../../styles/assets/Img";
import { TextInput } from "../../../../styles/assets/Input";
import P from "../../../../styles/assets/P";

const TableHover = styled(FlexDiv)`
    &:hover {
        background-color: ${theme.color.tableHo};
    }
`;

interface MajorItem {
    id?: number;
    college: string;
    major: string;
}

const ModalMajor = () => {
    const setOpen = useSetRecoilState(modalOpen);

    const closeModal = () => {
        setOpen(false);
    };

    const headerInfo = ["학교명", "단과대학", "학과명"];
    const widthList = [150, 160, 270];

    const [data, fetchData] = useFetch();
    const [major, setMajor] = useRecoilState<MajorItem[]>(majorInfo);
    const [selectedTable, setSelectedTable] = useRecoilState(majorSelected);

    const chooseMajor = (item: { college: string; major: string }) => {
        setSelectedTable((prev) => ({ ...prev, ...item }));
    };

    useEffect(() => {
        fetchData("/signUp/majorInfo", "GET");
        return () => {
            setMajor([]);
        };
    }, []);

    useEffect(() => {
        const handleData = () => {
            if (data) {
                let newData = { ...data };
                delete newData.change;

                const tmpContents: MajorItem[] = [];
                (Object.values(newData) as MajorItem[]).map((element: MajorItem) => {
                    tmpContents.push({
                        college: element.college,
                        major: element.major,
                    });
                });
                setMajor(tmpContents);
            }
        };

        handleData();
    }, [data]);

    const [searchTerm, setSearchTerm] = useState("");

    // 검색어와 일치하는 결과 필터링
    const filteredResults = major.filter((item) => item.major.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <FlexDiv
            width="44%"
            height="450px"
            $backgroundColor="wh"
            direction="column"
            $justifycontent="space-between"
            radius={2}
        >
            <FlexDiv $justifycontent="space-between" width="100%" $backgroundColor="bgColor" $padding="15px 20px">
                <Div>
                    <H2 fontSize="lg" color="wh">
                        전공검색
                    </H2>
                </Div>
                <Div height="24px" $pointer onClick={() => closeModal()}>
                    <Img src={"../images/x_white.svg"}></Img>
                </Div>
            </FlexDiv>

            <Div $padding="25px" width="100%" height="88%">
                <Div width="100%">
                    <TextInput
                        placeholder="전공을 검색하세요"
                        width="100%"
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    />
                </Div>
                <FlexDiv
                    width="100%"
                    height="45px"
                    $borderB={`1px solid ${theme.color.tableBorder}`}
                    $justifycontent="space-between"
                >
                    {headerInfo.map((item: string, idx: number) => (
                        <FlexDiv key={`headerInfo${idx}`} $minWidth={`${widthList[idx]}px`} $padding="10px">
                            <P $center fontWeight={700}>
                                {item}
                            </P>
                        </FlexDiv>
                    ))}
                </FlexDiv>
                <Div width="100%" height="60%" overflow="auto">
                    {filteredResults.map((element: { college: string; major: string }, idx: number) => (
                        <TableHover
                            key={`contentItem${idx}`}
                            width="100%"
                            height="45px"
                            $borderT={`1px solid ${theme.color.grey1}`}
                            $justifycontent="space-between"
                            $backgroundColor={selectedTable.major === element.major ? "tableHo" : "wh"}
                            $pointer
                            onClick={() => chooseMajor(element)}
                        >
                            <FlexDiv $padding="10px" $minWidth={`${widthList[0]}px`}>
                                <A $center>인하대학교</A>
                            </FlexDiv>
                            {Object.values(element).map((item: any, idx: number) => (
                                <FlexDiv key={`itemValue${idx}`} $minWidth={`${widthList[idx + 1]}px`} $padding="10px">
                                    <A $center>{item}</A>
                                </FlexDiv>
                            ))}
                        </TableHover>
                    ))}
                </Div>
                <FlexDiv width="100%">
                    <Button
                        $backgroundColor="bgColor"
                        $HBackgroundColor="bgColorHo"
                        $borderRadius={60}
                        width="150px"
                        height="40px"
                        $margin="15px 0 0 0"
                        onClick={() => closeModal()}
                    >
                        <P color="wh" fontWeight={400}>
                            확인
                        </P>
                    </Button>
                </FlexDiv>
            </Div>
        </FlexDiv>
    );
};

export default ModalMajor;