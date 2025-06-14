import { shallowMount, mount } from "@vue/test-utils";
import NavBar from "@/components/NavBar.vue";

describe("NavBar", () => {
    const wrapper = shallowMount(NavBar, {
        global: {
            stubs: {
                fa: true
            }
        }
    })

    let originalLocation;

    beforeAll(() => {
        // Save original window.location
        originalLocation = window.location;
        delete window.location;
    
        // Mock window.location
        window.location = { href: '' };
      });
    
      afterAll(() => {
        // Restore original window.location
        window.location = originalLocation;
      });

      it('renders Home link with correct href', () => {
        const links = wrapper.findAll('a');
        const homeLink = links[0];
    
        expect(homeLink.text()).toContain('Home');
        expect(homeLink.attributes('href')).toBe('#/home');
      });
    
      it('renders Logout link with correct icon and text', () => {
        const links = wrapper.findAll('a');
        const logoutLink = links[1];
    
        expect(logoutLink.text()).toContain('Logout');
        expect(logoutLink.attributes('href')).toBe('#');
      });

})