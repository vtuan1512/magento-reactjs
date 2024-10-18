import React from 'react'

const Contact = () => {
    return (
        <div>
            <div className="container mb-5">
                <div className="row">
                    <div className="col-12 text-center py-4 my-4">
                        <h1>Have Some Question?</h1>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md 5 d-flex justify-content-center">
                        <img src="/assets/images/contact.png" alt="Contact Us" height="300px" width="300px" />
                    </div>
                    <div className="col-md-6">
                        <form>
                            <div className="mb-3">
                                <label form="exampleForm" className="form-label">Full Name</label>
                                <input type="text" className="form-control" id="name"/>
                            </div>
                            <div className="mb-3">
                                <label form="exampleFormControlInput1" className="form-label">Email address</label>
                                <input type="email" className="form-control" id="email"
                                       />
                            </div>
                            <div className="mb-3">
                                <label form="exampleFormControlInput2" className="form-label">Phone number</label>
                                <input type="email" className="form-control" id="phonenum"
                                      />
                            </div>
                            <div className="mb-3">
                                <label form="exampleFormControlTextarea1" className="form-label"> What’s on your mind?</label>
                                <textarea className="form-control" id="what's on your mind?" rows="5"></textarea>
                            </div>
                            <button type="submit" className="btn btn-outline-primary">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact