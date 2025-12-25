type Route = '' | 'bmi';

class Router {
    private currentRoute: Route = '';

    constructor() {
        window.addEventListener('hashchange', () => this.handleRouteChange());
        // Initial route handling
        this.handleRouteChange();
    }

    private handleRouteChange() {
        const hash = window.location.hash.replace('#/', '') as Route;
        this.currentRoute = hash || '';
        this.updateViews();
    }

    private updateViews() {
        const mainView = document.getElementById('main-view');
        const bmiView = document.getElementById('bmi-view');

        if (!mainView || !bmiView) return;

        // Hide all views first
        mainView.classList.remove('active');
        bmiView.classList.remove('active');

        // Show the current view
        if (this.currentRoute === 'bmi') {
            bmiView.classList.add('active');
            document.title = 'BMI 计算器 | 小工具';
        } else {
            mainView.classList.add('active');
            document.title = '卡路里计算器 | 精准热量换算';
        }
    }

    navigate(path: Route) {
        window.location.hash = `/${path}`;
    }

    back() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            this.navigate('');
        }
    }
}

export const router = new Router();
