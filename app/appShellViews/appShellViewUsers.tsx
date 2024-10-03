import { Button, Card, Flex, NativeSelect, Text, Popover, PopoverDropdown, ScrollArea, Table, TextInput, Title } from '@mantine/core';
import React, { useState, useEffect } from 'react';

enum userPosition{
    operator='Operator',
    admin='Admin',
    spv='Supervisor'
}
enum userAccessLvl{
    basic='0',
    spv='1',
    admin='2'

}


interface usersDataInterface{
    id: string,
    userName: string,
    position: userPosition,
    accessLvl: userAccessLvl,
    password: string
}




export default function AppShellViewUsers(){
    const [userData, setUserData] = useState<usersDataInterface[]>([]);
    const [newUser, setNewUser] = useState<usersDataInterface>({
        id:'',
        userName:'',
        position:userPosition.operator,
        accessLvl:userAccessLvl.basic,
        password:''
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:8080/user');
                 // Ensure this endpoint exists in your Go server
                 console.log('Response:', response); 
                if (!response.ok) {
                    throw new Error('Failed to fetch user');
                }
                const data = await response.json();
                console.log('Fetched data:', data);
                
                // Ensure data is an array
                if (Array.isArray(data)) {
                    setUserData(data);
                } else {
                    console.error('Fetched data is not an array:', data);
                    setUserData([]); 
                }
            } catch (error) {
                console.error('Error fetching machine:', error);
                setUserData([]); // Set to empty array on error
            }
        };

        fetchUser();
    }, []);

    const handleAddUser = async () => {
        try {
            const response = await fetch('http://localhost:8080/add-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error('Failed to add job');
            }

            const addedUser = await response.json();
            setUserData([...userData, { ...addedUser, id: addedUser.id }]);

            setNewUser({
                id:'',
                userName:'',
                position:userPosition.operator,
                accessLvl:userAccessLvl.basic,
                password:''
                
            });
        } catch (error) {
            console.error('Error adding job:', error);
        }
    };
    const handleInputChange = (field: keyof usersDataInterface) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewUser({ ...newUser, [field]: event.target.value });
    };

    const handleDeleteUser = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:8080/delete-user/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setUserData(userData.filter(machine => machine.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return(
        <>
        <Flex direction='row' justify={'center'}>
                <Card>
                    <Flex direction={'row'} gap={'lg'} mb={'md'} justify={'center'}>
                        <Title>Users</Title>
                        <Popover width={600} trapFocus position="bottom" withArrow shadow="md">
                            <Popover.Target>
                                <Button>New User</Button>
                            </Popover.Target>
                            
                            <PopoverDropdown>
                                
                                    <TextInput
                                        label="Name"
                                        placeholder="Input placeholder"
                                        onChange={handleInputChange('userName')}
   
                                    />
                                    <NativeSelect
                                        label="Position"
                                        data={['-', userPosition.operator, userPosition.spv, userPosition.admin]}
                                        onChange={handleInputChange('position')}
                                    />
                                    <NativeSelect
                                        label="Access Level"
                                        data={['-', userAccessLvl.basic, userAccessLvl.spv, userAccessLvl.admin]}
                                        onChange={handleInputChange('accessLvl')}
                                    />
                                    <TextInput
                                        label="Password"
                                        placeholder="Input placeholder"
                                        onChange={handleInputChange('password')}
                                    />

                                    
                                    <Button mt="sm" onClick={handleAddUser}>Add User</Button>
                                
                            </PopoverDropdown>
                        </Popover>
                    </Flex>
                    <ScrollArea scrollbarSize={6} scrollHideDelay={0}>
                        {usersTable(userData,handleDeleteUser)}

                        
                    </ScrollArea>
                </Card>
            </Flex>
        </>
    )
    
}

function usersTable(elements: usersDataInterface[],onDelete: (id: string)=>void) {

    const rows = elements.map((element: usersDataInterface) => (
      <Table.Tr key={element.id}>
        <Table.Td>{element.userName}</Table.Td> 
        <Table.Td>{element.position}</Table.Td>
        <Table.Td>{element.accessLvl}</Table.Td>
        <Table.Td>{element.password}</Table.Td>
        <Table.Td>
            
                <Button color="red" variant="filled"  mr={"sm"}onClick={() => onDelete(element.id)} >Delete</Button>
                <Popover width={600} trapFocus position="bottom" withArrow shadow="md">
                    <Popover.Target>
                        <Button>Edit User</Button>
                    </Popover.Target>
                            
                    <PopoverDropdown>
                            <TextInput
                                label="Name"
                                placeholder="Input placeholder"
                            />
                            <NativeSelect
                                label="Position"
                                data={['-', userPosition.operator, userPosition.spv, userPosition.admin]}
                            />
                            <NativeSelect
                                label="Access Level"
                                data={['-', userAccessLvl.basic, userAccessLvl.spv, userAccessLvl.admin]}
                            />
                            <TextInput
                                label="Password"
                                placeholder="Input placeholder"
                            />
                            <Button mt="sm" >Edit User</Button>
                    </PopoverDropdown>
                </Popover>
        </Table.Td>
       
      </Table.Tr>
    ));
  
    return (
      <Table stickyHeader>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Position</Table.Th>
            <Table.Th>Access Level</Table.Th>
            <Table.Th>Password</Table.Th>
            <Table.Th>Delete User</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    );

  }