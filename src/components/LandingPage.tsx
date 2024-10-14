import React from 'react'
import { CContainer, CRow, CCol, CCard, CCardBody } from '@coreui/react-pro'
import Image from 'next/image'
import Link from 'next/link'

import hero from '@/public/images/hero.svg'
import productivity from '@/public/images/productivity.png'
import collaboration from '@/public/images/collaboration.png'
import adapt from '@/public/images/adapt1.png'
import care from '@/public/images/care.png'
import learning from '@/public/images/learning.svg'
import logo from '@/public/images/bd_logo.png'

import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const LandingPage: React.FC = () => {
  return (
    <div className={`${poppins.className}`}>
      <div className="pattern"></div>

      <CContainer className="mb-5 pt-5">
        <CRow className="text-left mb-4">
          <CCol className="mt-5" sm={12} lg={6}>
            <span
              className="fs-6 text-primary fw-semibold bg-primary-subtle rounded-pill py-1 px-2"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              Balboa Digital LMS
            </span>
            <h1 className="fw-bold display-3 lh-1 mt-2" data-aos="fade-up" data-aos-delay="200">
              Empower Your Workforce Through{' '}
              <span
                className="text-primary"
                style={{
                  background: '-webkit-linear-gradient(left, #06639b, #A6C31F)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Learning
              </span>
            </h1>
            <p className="mt-3 fs-5 text-secondary" data-aos="fade-up" data-aos-delay="300">
              Unlock potential, enhance skills, and drive growth with a seamless learning experience
              designed for your team.
            </p>
          </CCol>
          <CCol sm={12} lg={6} data-aos="fade-up-left" data-aos-delay="500">
            <Image
              src={hero}
              alt="e-learning image"
              width={500}
              height={400}
              className="float-animation"
              layout="responsive"
            />
          </CCol>
        </CRow>
      </CContainer>

      <div className=" pb-5 mb-5">
        <CContainer className="container">
          <CRow className="mb-5">
            <CCol lg={8} md={10}>
              <span
                className="fs-6 text-primary fw-semibold text-uppercase bg-primary-subtle rounded-pill py-1 px-2"
                data-aos="fade-up"
              >
                Our Vision
              </span>
              <h1 className="ls-tight fw-bold mb-3 mt-3" data-aos="fade-up">
                Why Learning Matters
              </h1>
              <p className="fs-5 text-muted" data-aos="fade-up" data-aos-delay="50">
                In today's fast-paced business world, continuous development is key to staying
                ahead. Our platform ensures your team is equipped with the knowledge and skills
                needed to excel in their roles, fostering a culture of growth and innovation.
              </p>
            </CCol>
          </CRow>
          <CRow className="g-4">
            <CCol lg={3} md={6} sm={12} data-aos="zoom-in-up" data-aos-delay="0">
              <CCard className="shadow-sm border-0">
                <CCardBody className="p-4">
                  <div className="mt-3 mb-4">
                    <div>
                      <Image src={productivity} width={60} height={60} alt="productivity icon" />
                    </div>
                  </div>
                  <div className="pt-2 pb-3">
                    <h5 className="h4 mb-2 fw-bold">Boost Productivity</h5>
                    <p className="text-muted mb-0">
                      Well-trained employees perform better, helping your company achieve higher
                      levels of efficiency and productivity.
                    </p>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol lg={3} md={6} sm={12} data-aos="zoom-in-up" data-aos-delay="50">
              <CCard className="shadow-sm border-0 mt-n4">
                <CCardBody className="p-4">
                  <div className="mt-3 mb-4">
                    <div>
                      <Image src={collaboration} width={70} height={70} alt="collaboration icon" />
                    </div>
                  </div>
                  <div className=" pb-3">
                    <h5 className="h4 mb-2 fw-bold">Foster Collaboration</h5>
                    <p className="text-muted mb-0">
                      Encourage team-based learning to build a stronger, more connected workforce
                      that works together to solve challenges.
                    </p>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol lg={3} md={6} sm={12} data-aos="zoom-in-up" data-aos-delay="100">
              <CCard className="shadow-sm border-0 mt-n8">
                <CCardBody className="p-4">
                  <div className="mt-3 mb-4">
                    <div>
                      <Image src={adapt} width={60} height={60} alt="adapt icon" />
                    </div>
                  </div>
                  <div className="pt-2 pb-3">
                    <h5 className="h4 mb-2 fw-bold">Adapt to Change</h5>
                    <p className="text-muted mb-0">
                      Equip your employees with the skills to adapt to new technologies and industry
                      trends, keeping your company agile.
                    </p>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
            <CCol lg={3} md={6} sm={12} data-aos="zoom-in-up" data-aos-delay="150">
              <CCard className="shadow-sm border-0 mt-n8">
                <CCardBody className="p-4">
                  <div className="mt-3 mb-4">
                    <div>
                      <Image src={care} width={60} height={60} alt="care icon" />
                    </div>
                  </div>
                  <div className="pt-2 pb-3">
                    <h5 className="h4 mb-2 fw-bold">Improve Retention</h5>
                    <p className="text-muted mb-0">
                      Employees who feel supported in their professional growth are more likely to
                      stay and thrive in your organization.
                    </p>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>

      <div className="pb-5">
        <CContainer className="max-w-screen-xl">
          <CRow className="justify-content-center text-center mb-20">
            <CCol lg={7}>
              <span
                className="fs-5 text-center text-primary fw-semibold text-uppercase bg-primary-subtle rounded-pill py-1 px-3"
                data-aos="fade-up"
              >
                Benefits
              </span>
              <h1 className="ls-tight fw-bold mb-3 mt-4" data-aos="fade-up" data-aos-delay="50">
                Optimized for Modern Learning
              </h1>
              <p
                className="font-semibold fs-5 text-secondary mb-3"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Empower your workforce with flexible, interactive, and accessible learning solutions
                that cater to today's fast-paced work environment, ensuring compliance and skill
                development.
              </p>
            </CCol>
          </CRow>
          <CRow className="g-10 align-items-center justify-content-between">
            <CCol lg={5} className="mb-5 mb-lg-0" data-aos="zoom-in-right">
              <Image alt="Demo card" src={learning} width={500} height={400} layout="responsive" />
            </CCol>
            <CCol lg={6}>
              <div className="d-flex mb-2" data-aos="fade-right" data-aos-delay="0">
                <div className="mt-n2">
                  <span
                    className="icon icon-lg text-secondary svg-current"
                    style={{ width: '40px' }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="currentColor"
                      className="bi bi-book-half"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                    </svg>
                  </span>
                </div>
                <div className="ps-5">
                  <h5 className="mb-2 fw-bold">Continuous Learning</h5>
                  <p className="text-muted">
                    Keep your team updated with the latest skills and knowledge, helping them stay
                    competitive and innovative.
                  </p>
                </div>
              </div>
              <div className="d-flex mb-2" data-aos="fade-right" data-aos-delay="100">
                <div className="mt-n2">
                  <span
                    className="icon icon-lg text-secondary  svg-current"
                    style={{ width: '40px' }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      fill="currentColor"
                      className="bi bi-pencil-square"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path
                        fill-rule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                      />
                    </svg>
                  </span>
                </div>
                <div className="ps-5">
                  <h5 className="mb-2 fw-bold">Tailored Training</h5>
                  <p className="text-muted">
                    Design courses and programs that meet the unique needs of your organization,
                    ensuring relevant and impactful learning.
                  </p>
                </div>
              </div>
              <div className="d-flex mb-2" data-aos="fade-right" data-aos-delay="200">
                <div className="mt-n2">
                  <span
                    className="icon icon-lg text-secondary svg-current"
                    style={{ width: '40px' }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30 "
                      fill="currentColor"
                      className="bi bi-file-earmark-bar-graph"
                      viewBox="0 0 16 16"
                    >
                      <path d="M10 13.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-6a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm-2.5.5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5zm-3 0a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5z" />
                      <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                    </svg>
                  </span>
                </div>
                <div className="ps-5">
                  <h5 className="mb-2 fw-bold">Progress Tracking</h5>
                  <p className="text-muted">
                    Monitor employee progress with detailed reports and insights, helping you
                    measure success and identify areas for improvement.
                  </p>
                </div>
              </div>
            </CCol>
          </CRow>
        </CContainer>
      </div>
      <div className="bg-dark">
        <div className="container">
          <footer className="bg-dark d-flex flex-wrap justify-content-between align-items-center py-4">
            <div className="col-md-4 d-flex align-items-center">
              <span className="mb-3 mb-md-0 fs-6 text-white-50">
                &copy; 2010-2024 Balboa Digital Inc. All Rights Reserved.
              </span>
            </div>

            <div>
              <Link
                href="https://www.balboadigital.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="me-3"
              >
                <Image src={logo} width={140} height={35} alt="lcsLogo" />
              </Link>
            </div>

            <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
              <Link
                href="https://www.linkedin.com/company/balboa-digital/"
                target="#"
                className="d-flex justify-content-center align-items-center text-sky-600 bg-dark hover-text-white hover-bg-sky-600 rounded-circle transition duration-150 ease-in-out"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="white"
                  className="bi bi-linkedin"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
                </svg>
              </Link>
            </ul>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
