import { Button, Card, Flex, NativeSelect, Popover, PopoverDropdown, ScrollArea, Table, TextInput, Title } from "@mantine/core";
import { useEffect, useState } from "react";

interface machineDataInterface{
    id: string,
    machineName: string,
    machineDescription: string
}


export default function AppShellViewMachine(){
    const [machineData, setMachineData] = useState<machineDataInterface[]>([]);
    const [newMachine, setNewMachine] = useState<machineDataInterface>({
        id:'',
        machineName:'',
        machineDescription:''
    });
    


    useEffect(() => {
        const fetchMachine = async () => {
            try {
                const response = await fetch('http://localhost:8080/machine');
                 // Ensure this endpoint exists in your Go server
                 console.log('Response:', response); 
                if (!response.ok) {
                    throw new Error('Failed to fetch machine');
                }
                const data = await response.json();
                console.log('Fetched data:', data);
                
                // Ensure data is an array
                if (Array.isArray(data)) {
                    setMachineData(data);
                } else {
                    console.error('Fetched data is not an array:', data);
                    setMachineData([]); 
                }
            } catch (error) {
                console.error('Error fetching machine:', error);
                setMachineData([]); // Set to empty array on error
            }
        };

        fetchMachine();
    }, []);

    const handleAddMachine = async () => {
        try {
            const response = await fetch('http://localhost:8080/add-machine', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMachine),
            });

            if (!response.ok) {
                throw new Error('Failed to add job');
            }

            const addedMachine = await response.json();
            setMachineData([...machineData, { ...addedMachine, id: addedMachine.id }]);

            setNewMachine({
                id:'',
                machineName: '',
                machineDescription: ''
                
            });
        } catch (error) {
            console.error('Error adding job:', error);
        }
    };
    const handleInputChange = (field: keyof machineDataInterface) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewMachine({ ...newMachine, [field]: event.target.value });
    };

    const handleDeleteMachine = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8080/delete-machine/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete machine');
            }

            setMachineData(machineData.filter(machine => machine.id !== id));
        } catch (error) {
            console.error('Error deleting machine:', error);
        }
    };

    
    return(
        <>
        <Flex direction='row' justify={'center'}>
                <Card>
                    <Flex direction={'row'} gap={'lg'} mb={'md'} justify={'center'}>
                        <Title>Machine</Title>
                        <Popover width={600} trapFocus position="bottom" withArrow shadow="md">
                            <Popover.Target>
                                <Button>New Machine</Button>
                            </Popover.Target>
                            
                            <PopoverDropdown>
                                
                                    <TextInput
                                        label="Machine Name"
                                        placeholder="Input placeholder"
                                        onChange={handleInputChange('machineName')}                                      
                                />
                                    <TextInput
                                        label="Machine Description"
                                        placeholder="Input placeholder"
                                        onChange={handleInputChange('machineDescription')}

                                    />
                                    
                                    <Button mt="sm" onClick={handleAddMachine}>Add Machine</Button>
                                
                            </PopoverDropdown>
                        </Popover>
                    </Flex>
                    <ScrollArea scrollbarSize={6} scrollHideDelay={0}>
                        {machineTable(machineData, handleDeleteMachine, )}

                        
                    </ScrollArea>
                </Card>
            </Flex>
        </>
    )

}
function machineTable(elements: machineDataInterface[],onDelete: (id: string) => void,) {

    const rows = elements.map((element: machineDataInterface) => (
      <Table.Tr key={element.id}>
        <Table.Td>{element.machineName}</Table.Td> 
        <Table.Td>{element.machineDescription}</Table.Td>
        <Table.Td>
            <Button color="red" variant="filled" mr={"xs"}  onClick={() => onDelete(element.id)} >Delete</Button>
            <Popover width={600} trapFocus position="bottom" withArrow shadow="md">
                            <Popover.Target>
                                <Button>Edit✏</Button>
                            </Popover.Target>
                            
                            <PopoverDropdown>
                                
                                    <TextInput
                                        label="Machine Name"
                                        placeholder="Input placeholder"   
                                    />
                                    <TextInput
                                        label="Machine Description"
                                        placeholder="Input placeholder"
                                    />
                                    
                                    <Button mt="sm" >Edit Machine</Button>
                                
                            </PopoverDropdown>
                        </Popover>
        </Table.Td>
      </Table.Tr>
    ));
  
    return (
      <Table stickyHeader>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Machine Name</Table.Th>
            <Table.Th>Machine Description</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    );

  }