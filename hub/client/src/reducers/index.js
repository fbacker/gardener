
import app from './app'

const rootReducer = {
    app,
};

export default rootReducer;


export function mapStateToProps(state) {
    return {
        app: app,
        
    }
}
