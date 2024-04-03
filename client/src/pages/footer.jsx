import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faEnvelope, faPhone, faPrint } from '@fortawesome/free-solid-svg-icons';


export default function Footer() {
  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted' >
   

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5 ' style={{ marginLeft: '150px'}}>
          
            <MDBCol md="4" lg="3" xl="10" className='text-center mx-auto mb-md-0 mb-4'>
            
               <p>
                <FontAwesomeIcon icon={faHome} className="me-3" />
                Surat, IND 10012, India
              </p>
              <p>
                <FontAwesomeIcon icon={faEnvelope} className="me-3" />
                echallan.support@gmail.com
              </p>
              
              <p>
                <FontAwesomeIcon icon={faPhone} className="me-3" />
                +01 234 567 88
              </p>
              <p>
                <FontAwesomeIcon icon={faPrint} className="me-3" />
                +01 234 567 89
              </p>
              <p>
              Designed, Developed & Hosted by :Om Oslaniy & Dax Padaliya
              </p>

            </MDBCol>
     
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2024 Copyright:E parking Challan
        
      </div>
    </MDBFooter>
  );
}