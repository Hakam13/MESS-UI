import { AppShellViewsConstants } from "@/app/atomConstantType/constants";
import {useAtom} from "jotai";
import {appShellViewState} from "@/app/atomConstantType/atoms";
import {Button, Flex, Grid, Title} from "@mantine/core";
import NavigationButton from "@/app/appShellModals/css/NavigationButton.module.css"


const sections = [
    {
        title: "Navigation",
        buttons: [
            { label: "Home", view: AppShellViewsConstants.AppShellViewHome },
            { label: "Historian", view: AppShellViewsConstants.AppShellViewHistorian },
            { label: "Events & Alarms", view: AppShellViewsConstants.AppShellViewAlarms },
            { label: "Admin", view: AppShellViewsConstants.AppShellViewAdminDashboard },
            { label: "Users", view: AppShellViewsConstants.AppShellViewUsers},
            { label: "Machine",view: AppShellViewsConstants.AppShellViewMachine }

        ],
    }
];

export default function AppShellModalViewSelector({ onClose }: { onClose: () => void }) {
    const [, setAppShellViewStateValue] = useAtom(appShellViewState);

    const handleViewSelection = (view: string) => {
        setAppShellViewStateValue(view);
        setTimeout(() => {
            onClose();
        }, 300); // Jeda 300ms sebelum menutup modal
    };

    return (
        <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
            {sections.map((section, idx) => (
                <Grid.Col span={4} key={idx}>
                    <Flex direction="column">
                        <Title order={3}>{section.title}</Title>
                        <Flex direction="column" mt="md" gap={5}>
                            {section.buttons.map((button, buttonIdx) => (
                                <Button
                                    key={buttonIdx}
                                    variant="light"
                                    radius="xs"
                                    classNames={NavigationButton}
                                    onClick={() => handleViewSelection(button.view)}
                                >
                                    {button.label}
                                </Button>
                            ))}
                        </Flex>
                    </Flex>
                </Grid.Col>
            ))}
        </Grid>
    );
}
