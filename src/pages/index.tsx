import { Button, Center, Container, Flex } from "@mantine/core"
import Link from "next/link"

const HomePage = () => {
  return (
    <Container>
      <Center>
        <Flex
          direction={{ base: "column", sm: "column" }}
          gap={{ base: "sm", sm: "lg" }}
          justify={{ sm: "center" }}
        >
          <Link href="/quiz">
            <Button fullWidth variant="default" size="md">
              Start Answering Questions
            </Button>
          </Link>
          <Link href="/upload">
            <Button fullWidth variant="default" size="md">
              Upload Questions
            </Button>
          </Link>
        </Flex>
      </Center>
    </Container>
  )
}

export default HomePage
