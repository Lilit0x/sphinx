import React, { ReactNode } from "react";
import {
    AppShell,
    Footer,
    Group,
    Header,
    Text
} from "@mantine/core"

interface Props {
    children?: ReactNode
}

export const ApplicationContainer = ({children}: Props) => {
    return(
        <AppShell
        styles={{
            main: {
                background: '#FFFFFF',
                width: "100vw",
                height: "100vh",
                paddingLeft: '0px',
            }
        }}
        fixed
        footer={
            <Footer height={60} p="md">
                <Group position="apart" spacing="xl">
                    <Text size="sm"><span style={{fontWeight: "bolder"}}
                    >🕛 List Time: </span>0h 25m</Text>
                    <Text size="sm"><span style={{fontWeight: "bolder"}}
                    >🎆 End Time: </span>5:36pm</Text>
                </Group>
            </Footer>
        }
        header={
            <Header height={70} p="md">
                <div style={{display: "flex", alignItems: 'center', height: "100%"}}>
                    <Text size="lg" weight="bolder">Al Qalam Academy CBT</Text>
                </div>
            </Header>
        }
        
        >
          {children}
        </AppShell>
    )
}