import { Card, Flex, Title, Text, Table, TableData, Progress, Button,ScrollArea, px } from "@mantine/core";
import GaugeChartComponent from "../appShellComponents/GaugeChartComponent";

enum problemStatus {
    notified='Notified',
    acknowledged='Acknowledged',
    resolved='Resolved',
    troubleshooting='Troubleshooting'
}
enum activeJob{
    active='on',
    inactive='off'
}
enum productionStatus{
    ongoing='On-Going',
    postponed='Postponed',
    completed='Completed'
}
interface problemsDataInterface {
    order: string,
    time: string,
    problems: string,
    status: problemStatus,
    action: string,
}

interface upcomingOrderInterface{
    order: string,
    status: string,
    changeJob: activeJob,
}

interface productionInformationInterface{
    order: string,
    start: string,
    end: string,
    status: string
}

const problemsData: problemsDataInterface[] = [
    { order: '1004', time:'26/09/2024 03:20pm', problems: '3', status: problemStatus.resolved, action: '5' },
    { order: '1003', time:'26/09/2024 03:20pm', problems: '3', status: problemStatus.notified, action: '5' },
    { order: '1039', time:'26/09/2024 03:20pm', problems: '3', status: problemStatus.acknowledged, action: '5' },
    { order: '1002', time:'26/09/2024 03:20pm', problems: '3', status: problemStatus.troubleshooting, action: '5' }
]



const productionsData: productionInformationInterface[]= 
    
    [
      {order:'1004', start:'26/09/2024 03:20pm', end:'-', status: productionStatus.ongoing},
      {order:'1003', start:'26/09/2024 03:20pm', end:'-', status: productionStatus.postponed},
      {order:'1039', start:'26/09/2024 03:20pm', end:'-', status: productionStatus.completed},
      {order:'1002', start:'26/09/2024 03:20pm', end:'-', status: productionStatus.completed},
      {order:'1001', start:'26/09/2024 03:20pm', end:'-', status: productionStatus.completed}
     
    ]
  

    
    const upcoming: upcomingOrderInterface[] = [

      {order:'1004', status: 'On-Going', changeJob: activeJob.active},
      {order:'1003', status: 'Postponed', changeJob: activeJob.inactive},
      {order:'1039', status: 'Completed', changeJob:activeJob.inactive},
      {order:'1002', status: 'Completed', changeJob:activeJob.inactive},
      {order:'1001', status: 'Completed', changeJob:activeJob.inactive}
    
    ];
  

  
export default function HomeView(){

    return(
        <>
            <Flex direction="column" gap={"sm"}>
                <Card>
                    <Title order={5}>Performance Tracker</Title>
                </Card>
                
                <Flex direction={"row"} gap={"sm"}>
                    <Flex direction={"column"} gap={"sm"}>
                        <Card>
                            <Title order={5}>Order Progress</Title>
                            <Progress color="teal" size="lg" value={30} striped animated mt={"md"}/>
                        </Card>
                        <Card>
                            <Title order={5}>Machine Speed</Title>
                            <GaugeChartComponent/>
                        </Card>
                    </Flex>
                        
                    
                    
                    <Flex direction={"column"}gap={"sm"}>
                        <Card>
                            <Title order={5}>Order Information</Title>
                            <Text>Name: #1004</Text>
                            <Text>Description: Manufacture 500 of Product C</Text>
                            <Text>Status: Urgent</Text>
                            <Text>Start Time: 26/09/2024 03:20pm</Text>
                            <Text>Completion Time: 27/09/2024 03:20pm</Text>
                        </Card>
                        <Card>
                            <Title order={5}>Production Information</Title>
                            <ScrollArea h={250} scrollbarSize={6} scrollHideDelay={0} >
                                {productionOrder(productionsData)}
                            </ScrollArea>
                        </Card>
                    </Flex>
                    <Flex direction={"column"}gap={"sm"}>
                        <Card>
                            <Flex direction={"row"}gap={"md"}>
                                <Title order={5}>Problems during Production</Title>
                                <Button size="sm">Add Problems</Button>
                            </Flex>
                            <ScrollArea h={200} scrollbarSize={6} scrollHideDelay={0} >
                                {ProblemsTable(problemsData)}
                            </ScrollArea>
                        </Card>
                        <Card>
                            <Title order={5}>Upcoming Orders</Title>
                            <ScrollArea h={250} scrollbarSize={6} scrollHideDelay={0} >
                                {upcomingOrder(upcoming)}
                            </ScrollArea>
                        </Card>
                    </Flex>

                </Flex>

            </Flex>
        </>
    )
}

function ProblemsTable(elements: problemsDataInterface[]) {

    const rows = elements.map((element: problemsDataInterface) => (
      <Table.Tr key={element.order}>
        <Table.Td>{element.order}</Table.Td>
        <Table.Td>{element.time}</Table.Td>
        <Table.Td>{element.problems}</Table.Td>
        <Table.Td>{element.status}</Table.Td>
        <Table.Td>
            {
                element.status == problemStatus.resolved 
                ? 
                <>
                    <Button>Delete</Button>
                </> 
                : 
                <>
                    <Button>Acknowledge</Button>
                </>
            }
        </Table.Td>
      </Table.Tr>
    ));
  
    return (
      <Table stickyHeader>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order</Table.Th>
            <Table.Th>Time</Table.Th>
            <Table.Th>Problems</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Action</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    );

  }

  function upcomingOrder(elements: upcomingOrderInterface[]) {

    const rows = elements.map((element: upcomingOrderInterface) => (
      <Table.Tr key={element.order}>
        <Table.Td>{element.order}</Table.Td> 
        <Table.Td>{element.status}</Table.Td>
        <Table.Td>
            {
                element.changeJob == activeJob.active
                ? 
                <>
                    <Button disabled>Change</Button>
                </> 
                : 
                <>
                    <Button>Change</Button>
                </>
            }
        </Table.Td>
      </Table.Tr>
    ));
  
    return (
      <Table stickyHeader>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Active Job</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    );

  }
  function productionOrder(elements: productionInformationInterface[]){
    const rows = elements.map((element: productionInformationInterface) => (
        <Table.Tr key={element.order}>
          <Table.Td>{element.order}</Table.Td>
          <Table.Td>{element.start}</Table.Td>
          <Table.Td>{element.end}</Table.Td> 
          <Table.Td>{element.status}</Table.Td>
          

          
          
        </Table.Tr>
      ));
    
      return (
        <Table stickyHeader>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Order</Table.Th>
              <Table.Th>Time Started</Table.Th>
              <Table.Th>Time Completed</Table.Th>
              <Table.Th>Status</Table.Th>
              
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      );
  }

  