import React from 'react'
import { Container , Text , Box ,TabList,TabPanel,TabPanels,Tabs,Tab, Center} from '@chakra-ui/react'; 
import Login from '../components/Authentication/login';
import Signup from '../components/Authentication/signup';


const Homepage = () => {
  return (
    <Container maxW="xl" centerContent> 
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="transparent"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        backdropFilter = "blur(6px)"
        borderTop={"2px solid #162938"}
      >
        <Center>
          <Text fontSize="4xl" fontFamily=" Libre Baskerville " alignContent="center">
            Chamber Of Secrets
          </Text>
        </Center>
      </Box>
      <Box bg="transparent" w="100%" p={4} borderRadius="lg" borderWidth="1px" backdropFilter = "blur(6px)" borderBottom={"2px solid #162938"}>
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default Homepage
