document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing application...');

  // Sidebar Management
  const elements = {
    sidebar: document.getElementById('sidebar'),
    mainContent: document.getElementById('mainContent'),
    topNav: document.getElementById('topNav'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    toggleIcon: document.getElementById('toggleIcon')
  };

  /**
   * Collapses the sidebar to w-20, centers icons, hides dropdowns.
   */
  function collapseSidebar() {
    if (!elements.sidebar) return;
    elements.sidebar.classList.add('w-20');
    elements.sidebar.classList.remove('w-60');
    if (elements.mainContent) {
      elements.mainContent.classList.add('ml-20');
      elements.mainContent.classList.remove('ml-60');
    }
    if (elements.topNav) {
      elements.topNav.classList.add('left-20');
      elements.topNav.classList.remove('left-60');
    }
    if (elements.toggleIcon) {
      elements.toggleIcon.classList.add('rotate-180');
    }
    // Hide sidebar text
    document.querySelectorAll('.sidebar-text').forEach(el => {
      el.classList.add('opacity-0');
    });
    // Center icons and hide arrows/badges
    document.querySelectorAll('.nav-list').forEach(nav => {
      const link = nav.querySelector('a, button');
      if (link) {
        link.classList.add('justify-center');
        link.classList.remove('items-center');
        const img = link.querySelector('img:not([alt="arrow-down"])');
        if (img) {
          img.classList.remove('mr-2');
          img.classList.add('mx-auto');
        }
      }
      // Hide arrows, badges, and dropdowns
      const arrow = nav.querySelector('img[alt="arrow-down"]');
      if (arrow) {
        arrow.classList.add('hidden');
      }
      const badge = nav.querySelector('.bg-danger');
      if (badge) {
        badge.classList.add('hidden');
      }
      const dropdown = nav.querySelector('.dropdown-menu');
      if (dropdown) {
        dropdown.classList.add('hidden');
        dropdown.classList.remove('is-open');
        dropdown.style.height = '0';
      }
    });
    // Close all dropdowns
    dropdowns.forEach(dropdown => dropdown.close());
    localStorage.setItem('sidebarState', 'collapsed');
    console.log('Sidebar collapsed, icons centered, dropdowns hidden');
  }

  /**
   * Expands the sidebar to w-60, restores icon alignment.
   */
  function expandSidebar() {
    if (!elements.sidebar) return;
    elements.sidebar.classList.add('w-60');
    elements.sidebar.classList.remove('w-20');
    if (elements.mainContent) {
      elements.mainContent.classList.add('ml-60');
      elements.mainContent.classList.remove('ml-20');
    }
    if (elements.topNav) {
      elements.topNav.classList.add('left-60');
      elements.topNav.classList.remove('left-20');
    }
    if (elements.toggleIcon) {
      elements.toggleIcon.classList.remove('rotate-180');
    }
    // Show sidebar text
    document.querySelectorAll('.sidebar-text').forEach(el => {
      el.classList.remove('opacity-0');
    });
    // Restore icon alignment and show arrows/badges
    document.querySelectorAll('.nav-list').forEach(nav => {
      const link = nav.querySelector('a, button');
      if (link) {
        link.classList.add('items-center');
        link.classList.remove('justify-center');
        const img = link.querySelector('img:not([alt="arrow-down"])');
        if (img) {
          img.classList.add('mr-2');
          img.classList.remove('mx-auto');
        }
      }
      // Show arrows and badges
      const arrow = nav.querySelector('img[alt="arrow-down"]');
      if (arrow) {
        arrow.classList.remove('hidden');
      }
      const badge = nav.querySelector('.bg-danger');
      if (badge) {
        badge.classList.remove('hidden');
      }
    });
    localStorage.setItem('sidebarState', 'expanded');
    console.log('Sidebar expanded, icon alignment restored');
  }

  /**
   * Toggles sidebar state based on current state.
   */
  function toggleSidebar() {
    const isCollapsed = elements.sidebar.classList.contains('w-20');
    if (isCollapsed) {
      expandSidebar();
    } else {
      collapseSidebar();
    }
  }

  // Initialize sidebar state
  const initialSidebarState = localStorage.getItem('sidebarState');
  if (initialSidebarState === 'collapsed') {
    collapseSidebar();
  } else {
    expandSidebar();
  }

  // Event listener for sidebar toggle
  if (elements.sidebarToggle) {
    elements.sidebarToggle.addEventListener('click', () => {
      console.log('Sidebar toggle clicked');
      toggleSidebar();
    });
  } else {
    console.warn('Sidebar toggle button not found');
  }

  // Dropdown Management
  const dropdowns = [];

  class Dropdown {
    constructor(button, menu) {
      this.button = button;
      this.menu = menu;
      this.isOpen = false;
      this.isUserMenu = menu.id === 'user-menu';
      this.isLanguageMenu = menu.id === 'language-menu';
      this.isDownloadMenu = menu.id === 'download-menu';
      dropdowns.push(this);
      this.init();
    }

    init() {
      this.button.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default for <button>
        console.log(`Toggling dropdown: ${this.button.id}, isOpen: ${this.isOpen}`);
        this.toggle();
      });
      this.button.addEventListener('keydown', (e) => this.handleKeydown(e));
      // Close dropdown when clicking outside
      document.addEventListener('click', (event) => {
        if (!event.target.closest(`#${this.button.id}`) && !event.target.closest(`#${this.menu.id}`)) {
          console.log(`Outside click detected, closing dropdown: ${this.button.id}`);
          this.close();
        }
      });
      // Handle form submissions in language menu or clicks in download menu
      if (this.isLanguageMenu) {
        this.menu.querySelectorAll('.language-form').forEach(form => {
          form.addEventListener('submit', (e) => {
            console.log(`Language form submitted in dropdown: ${this.button.id}`);
            this.close(); // Close dropdown before form submission
          });
        });
      } else if (this.isDownloadMenu) {
        this.menu.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
            console.log(`Download link clicked in dropdown: ${this.button.id}`);
            this.close(); // Close dropdown after clicking PDF/Excel
          });
        });
      }
    }

    open() {
      if (this.isOpen || (elements.sidebar && elements.sidebar.classList.contains('w-20') && !this.isLanguageMenu && !this.isUserMenu && !this.isDownloadMenu)) return;
      console.log(`Opening dropdown: ${this.button.id}`);
      // Close all other dropdowns
      dropdowns.forEach((dropdown) => {
        if (dropdown !== this && dropdown.isOpen) {
          dropdown.close();
        }
      });
      this.isOpen = true;
      this.menu.classList.add('is-open');
      this.menu.classList.remove('hidden');
      // Ensure button remains visible
      this.button.classList.remove('hidden');
      this.button.style.display = this.isDownloadMenu ? 'inline-flex' : 'flex';
      if (this.isUserMenu) {
        // Position user menu absolutely below the three-dot icon
        const buttonRect = this.button.getBoundingClientRect();
        this.menu.style.position = 'absolute';
        this.menu.style.top = `${buttonRect.bottom - elements.sidebar.getBoundingClientRect().top}px`;
        this.menu.style.right = '1rem';
        this.menu.style.height = 'auto';
      } else if (this.isLanguageMenu || this.isDownloadMenu) {
        // Position language/download menu absolutely below the button
        const buttonRect = this.button.getBoundingClientRect();
        const parentRect = this.isLanguageMenu ? elements.topNav.getBoundingClientRect() : this.button.parentElement.getBoundingClientRect();
        this.menu.style.position = 'absolute';
        this.menu.style.top = `${buttonRect.bottom - parentRect.top}px`;
        this.menu.style.left = `${buttonRect.left - parentRect.left}px`;
        this.menu.style.height = 'auto';
      } else {
        // Other dropdowns use relative positioning with height animation
        this.menu.style.position = 'relative';
        this.menu.style.height = `${this.menu.scrollHeight}px`;
      }
      this.button.setAttribute('aria-expanded', 'true');
      const arrow = this.button.querySelector('img[alt="arrow-down"]');
      if (arrow) {
        arrow.classList.add('rotate-180');
      }
    }

    close() {
      if (!this.isOpen) return;
      console.log(`Closing dropdown: ${this.button.id}`);
      this.isOpen = false;
      this.menu.classList.remove('is-open');
      if (this.isUserMenu || this.isLanguageMenu || this.isDownloadMenu) {
        this.menu.style.height = 'auto';
      } else {
        this.menu.style.height = '0';
      }
      this.menu.classList.add('hidden');
      // Ensure button remains visible
      this.button.classList.remove('hidden');
      this.button.style.display = this.isDownloadMenu ? 'inline-flex' : 'flex';
      this.button.setAttribute('aria-expanded', 'false');
      const arrow = this.button.querySelector('img[alt="arrow-down"]');
      if (arrow) {
        arrow.classList.remove('rotate-180');
      }
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    handleKeydown(e) {
      if (e.key === 'Enter' || e.key === 'Space') {
        e.preventDefault();
        console.log(`Keydown toggle on dropdown: ${this.button.id}`);
        this.toggle();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (this.isOpen) {
          console.log(`Escape key closing dropdown: ${this.button.id}`);
          this.close();
        }
      }
    }
  }

  // Initialize dropdowns
  document.querySelectorAll('.dropdown-toggle, .download-toggle').forEach((button) => {
    const menuId = button.getAttribute('aria-controls');
    const menu = document.getElementById(menuId);
    if (menu) {
      console.log(`Initializing dropdown: ${button.id}`);
      new Dropdown(button, menu);
    } else {
      console.warn(`Dropdown menu not found for button: ${button.id}`);
    }
  });
});
