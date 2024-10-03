import { Button, Card, Flex, NativeSelect, Popover, PopoverDropdown, ScrollArea, Table, TextInput, Title } from "@mantine/core";
import React, { useState, useEffect } from 'react';

enum workStatus {
    start='start',
    stop='stop',
    postponed='postponed'
}

enum urgencyStatus {
    normal = 'Normal',
    urgent = 'Urgent'
}

interface WorkDataInterface {
    id: string; 
    workName: string;
    workDescription: string;
    machine: string;
    operator: string;
    quantity: string;
    start: string;
    end: string;
    urgency: urgencyStatus;
    status: workStatus;
}
interface Machine {
    id: string;
    machineName: string;
}
interface User {
    id: string;
    userName: string;
    position: string;
}

export default function AppShellViewAdminDashboard() {
    const [workData, setWorkData] = useState<WorkDataInterface[]>([]);
    const [operators, setOperators] = useState<User[]>([]);
    const [machines, setMachines] = useState<Machine[]>([]);
    const [newJob, setNewJob] = useState<WorkDataInterface>({
        id:'',
        workName: '',
        workDescription: '',
        machine: '',
        operator: '',
        quantity: '',
        start: '',
        end: '',
        urgency: urgencyStatus.normal,
        status: workStatus.stop
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('http://localhost:8080/jobs');
                if (!response.ok) {
                    throw new Error('Failed to fetch jobs');
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setWorkData(data);
                } else {
                    console.error('Fetched data is not an array:', data);
                    setWorkData([]);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
                setWorkData([]);
            }
        };

        const fetchMachines = async () => {
            try {
                const response = await fetch('http://localhost:8080/machine'); 
                if (!response.ok) {
                    throw new Error('Failed to fetch machines');
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setMachines(data);
                } else {
                    console.error('Fetched machines data is not an array:', data);
                    setMachines([]);
                }
            } catch (error) {
                console.error('Error fetching machines:', error);
                setMachines([]);
            }
        };

        const fetchOperators = async () => {
            try {
                const response = await fetch('http://localhost:8080/operator'); 
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setOperators(data);
                } else {
                    console.error('Fetched users data is not an array:', data);
                    setOperators([]);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setOperators([]);
            }
        };

        fetchJobs();
        fetchOperators();
        fetchMachines();
    }, []);
    const fetchOperators = async () => {
        try {
            const response = await fetch('http://localhost:8080/user'); 
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                // Filter users where position is 'operator'
                const filteredOperators = data.filter((user: User) => user.position === 'operator');
                setOperators(filteredOperators);
            } else {
                console.error('Fetched users data is not an array:', data);
                setOperators([]);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setOperators([]);
        }
    };

    const handleInputChange = (field: keyof WorkDataInterface) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewJob({ ...newJob, [field]: event.target.value });
    };

    

    const handleAddJob = async () => {
        try {
            const response = await fetch('http://localhost:8080/add-job', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newJob),
            });

            if (!response.ok) {
                throw new Error('Failed to add job');
            }

            const addedJob = await response.json();
            setWorkData([...workData, { ...addedJob, id: addedJob.id }]);

            setNewJob({
                id:'',
                workName: '',
                workDescription: '',
                machine: '',
                operator: '',
                quantity: '',
                start: '',
                end: '',
                urgency: urgencyStatus.normal,
                status: workStatus.stop
            });
        } catch (error) {
            console.error('Error adding job:', error);
        }
    };

    const handleDeleteJob = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8080/delete-job/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete job');
            }

            setWorkData(workData.filter(job => job.id !== id));
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    return (
        <>
            <Flex direction='row' justify={'center'}>
                <Card>
                    <Flex direction={'row'} gap={'lg'} mb={'md'} justify={'center'}>
                        <Title>Admin</Title>

                        <Popover width={600} trapFocus position="bottom" withArrow shadow="md">
                            <Popover.Target>
                                <Button>New Job</Button>
                            </Popover.Target>
                            
                            <PopoverDropdown>
                                
                                    <TextInput
                                        label="Workname"
                                        placeholder="Input placeholder"
                                        value={newJob.workName}
                                        onChange={handleInputChange('workName')}
                                    />
                                    <TextInput
                                        label="Work Description"
                                        placeholder="Input placeholder"
                                        value={newJob.workDescription}
                                        onChange={handleInputChange('workDescription')}
                                    />
                                    <NativeSelect 
                                        label="Machine" 
                                        data={machines.map(machine => ({ value: machine.id, label: machine.machineName }))}
                                        value={newJob.machine}
                                        onChange={handleInputChange('machine')}
                                    />
                                    <NativeSelect
                                        label="Operator"
                                        data={operators.map(operator => ({ value: operator.id, label: operator.userName }))} 
                                        value={newJob.operator}
                                        onChange={handleInputChange('operator')}
                                    />
                                    <TextInput
                                        label="Quantity"
                                        placeholder="Input placeholder"
                                        type="number"
                                        value={newJob.quantity}
                                        min="0"
                                        onChange={handleInputChange('quantity')}
                                    />
                                    <TextInput
                                        label="Start Date"
                                        type="date"
                                        value={newJob.start}
                                        onChange={handleInputChange('start')}
                                    />
                                    <TextInput
                                        label="Completion Date"
                                        type="date"
                                        value={newJob.end}
                                        onChange={handleInputChange('end')}
                                    />
                                    <NativeSelect
                                        label="Urgency"
                                        data={['-', urgencyStatus.normal, urgencyStatus.urgent]}
                                        value={newJob.urgency}
                                        onChange={handleInputChange('urgency')}
                                    />
                                    <Button mt="sm" onClick={handleAddJob}>Add Job</Button>
                                
                            </PopoverDropdown>
                        </Popover>
                    </Flex>
                    <ScrollArea scrollbarSize={6} scrollHideDelay={0}>
                        {productionOrder(workData, handleDeleteJob)}
                    </ScrollArea>
                </Card>
            </Flex>
        </>
    );
}

function productionOrder(elements: WorkDataInterface[], onDelete: (id: string) => void) {
    const rows = elements.map((element: WorkDataInterface) => (
        <Table.Tr key={element.id}>
            <Table.Td>{element.workName}</Table.Td>
            <Table.Td>{element.workDescription}</Table.Td>
            <Table.Td>{element.machine}</Table.Td>
            <Table.Td>{element.operator}</Table.Td>
            <Table.Td>{element.quantity}</Table.Td>
            <Table.Td>{element.start}</Table.Td>
            <Table.Td>{element.end}</Table.Td>
            <Table.Td>{element.urgency}</Table.Td>
            <Table.Td>{element.status}</Table.Td>
            <Table.Td>
                {
                    element.status === workStatus.start
                    ? <Button color="red" variant="filled" >Stop</Button>
                    : <Button>Start</Button>
                }
            </Table.Td>
            <Table.Td>
                <Button color="red" variant="filled"  onClick={() => onDelete(element.id)}>Delete</Button>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table stickyHeader >
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>Order</Table.Th>
                    <Table.Th>Order Description</Table.Th>
                    <Table.Th>Machine</Table.Th>
                    <Table.Th>Operator</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                    <Table.Th>Start Time</Table.Th>
                    <Table.Th>Completion Time</Table.Th>
                    <Table.Th>Urgency</Table.Th>
                    <Table.Th>Order Status</Table.Th>
                    <Table.Th>Order Start</Table.Th>
                    <Table.Th>Delete Job</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
    );
}
