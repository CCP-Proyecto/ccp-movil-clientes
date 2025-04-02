// Mock completo para expo-router
const mockRouter = {
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn().mockReturnValue(true),
  }),
  useNavigation: jest.fn(),
  useLocalSearchParams: jest.fn().mockReturnValue({}),
  useGlobalSearchParams: jest.fn().mockReturnValue({}),
  useSegments: jest.fn().mockReturnValue([]),
  Slot: ({ children }: { children: React.ReactNode }) => children,
  Stack: {
    Screen: ({ children }: { children: React.ReactNode }) => children,
  },
  Link: ({ children }: { children: React.ReactNode }) => children,
  Redirect: ({ href }: { href: string }) => null,
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
};

module.exports = mockRouter;
