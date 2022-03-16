import React from 'react';
import styled from 'styled-components';

export default function Empty() {
    return (
        <ComponentContainer>
            <EmptyImage source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Microsoft_To-Do_icon.png'}}></EmptyImage>
            <EmptyText>Add To-Do.</EmptyText>
        </ComponentContainer>
    );
}

const ComponentContainer = styled.View`
    align-items: center;
    justify-content: center;
    height: 650px;
`;

const EmptyImage = styled.Image`
    width: 100%;
    height: 100%;
    resizeMode: contain;
`;

const EmptyText = styled.Text`
    color: white;
    font-family: poppins-bold;
    margin-top: 30px;
    font-size: 30px;
`;