"""
Script to create multi-page authoritative PDFs for IP-SAKTI Sahayak
Based strictly on the official gazettes and treaties attached by the user.
"""
import os
import sys
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def build_pdf(filepath: Path, pages: list[str]):
    filepath.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(filepath), pagesize=letter)
    width, height = letter
    
    for page_idx, page_text in enumerate(pages, 1):
        text_obj = c.beginText(40, height - 50)
        text_obj.setFont("Helvetica", 8)
        text_obj.setLeading(10)
        
        # Header with page number
        c.setFont("Helvetica-Bold", 8)
        c.drawString(40, height - 35, f"Page {page_idx} | {filepath.name}")
        c.setStrokeColorRGB(0.7, 0.7, 0.7)
        c.setLineWidth(0.5)
        c.line(40, height - 38, width - 40, height - 38)
        
        # Footer
        c.setFont("Helvetica", 7)
        c.drawString(width / 2 - 20, 25, f"- {page_idx} -")
        
        lines = page_text.split("\n")
        y_pos = height - 50
        
        for raw_line in lines:
            line = raw_line.strip()
            if not line:
                text_obj.textLine("")
                y_pos -= 10
                if y_pos < 50:
                    break
                continue
                
            # Line wrap at 95 characters
            while len(line) > 95:
                split_at = line[:95].rfind(" ")
                if split_at == -1 or split_at < 50:
                    split_at = 95
                part = line[:split_at]
                line = line[split_at:].strip()
                text_obj.textLine(part)
                y_pos -= 10
                if y_pos < 50:
                    break
                    
            if y_pos >= 50:
                text_obj.textLine(line)
                y_pos -= 10
            else:
                break
                
        c.drawText(text_obj)
        c.showPage()
        
    c.save()
    print(f"Created: {filepath} ({len(pages)} pages)")


# International: WIPO Treaty GRATK 2024
wipo_pages = [
    """WIPO Treaty on Intellectual Property, Genetic Resources and Associated Traditional Knowledge
Adopted at Geneva on May 24, 2024
TABLE OF CONTENTS:
Article 1: Objectives
Article 2: List of Terms
Article 3: Disclosure Requirement
Article 4: Non-Retroactivity
Article 5: Sanctions and Remedies
Article 6: Information Systems
Article 7: Relationship with Other International Agreements
Article 8: Review
Article 9: General Principles on Implementation
World Intellectual Property Organization (WIPO) TRT/GRATK/001""",
    """The Parties to this Treaty,
Desiring the promotion of the efficacy, transparency and quality of the patent system in relation to genetic resources and traditional knowledge associated with genetic resources,
Emphasizing the importance of patent offices having access to appropriate information on genetic resources and traditional knowledge associated with genetic resources to prevent patents from being granted erroneously for inventions that are not novel or inventive with regard to genetic resources and traditional knowledge associated with genetic resources,
Recognizing the potential role of the patent system in contributing to the protection of genetic resources and traditional knowledge associated with genetic resources,
Recognizing that an international disclosure requirement related to genetic resources and traditional knowledge associated with genetic resources in patent applications contributes to legal certainty and consistency.""",
    """Article 1: Objectives
The objectives of this Treaty are to:
(a) enhance the efficacy, transparency and quality of the patent system with regard to genetic resources and traditional knowledge associated with genetic resources, and
(b) prevent patents from being granted erroneously for inventions that are not novel or inventive with regard to genetic resources and traditional knowledge associated with genetic resources.

Article 2: List of Terms
For the purposes of this Treaty:
"Applicant" means the person whom the records of the Office show, pursuant to the applicable law, as the person who is applying for the granting of a patent.
"Application" means an application for granting of a patent.
"Country of origin of genetic resources" means the country which possesses those genetic resources in in situ conditions.
"Based on" means that the genetic resources and/or traditional knowledge associated with genetic resources must have been necessary for the claimed invention, and that the claimed invention must depend on the specific properties of the genetic resources and/or on the traditional knowledge associated with genetic resources.""",
    """Article 2 (Continued): List of Terms
"Genetic material" means any material of plant, animal, microbial or other origin containing functional units of heredity.
"Genetic resources" are genetic material of actual or potential value.
"In situ conditions" means conditions where genetic resources exist within ecosystems and natural habitats.
"Office" means the authority of a Contracting Party entrusted with the granting of patents.
"PCT" refers to the Patent Cooperation Treaty, 1970.
"Source of genetic resources" refers to any source from which the applicant has obtained the genetic resources, such as a research center, gene bank, Indigenous Peoples and local communities, the Multilateral System of the ITPGRFA, or any other ex situ collection or depository.
"Source of traditional knowledge associated with genetic resources" means any source from which the applicant has obtained the traditional knowledge, such as scientific literature, publicly accessible databases, patent applications and patent publications.

Article 3: Disclosure Requirement
3.1 Where the claimed invention in a patent application is based on genetic resources, each Contracting Party shall require applicants to disclose:
(a) the country of origin of the genetic resources, or,
(b) in cases where the information in Article 3.1(a) is not known to the applicant, or where Article 3.1(a) does not apply, the source of the genetic resources.
3.2 Where the claimed invention in a patent application is based on traditional knowledge associated with genetic resources, each Contracting Party shall require applicants to disclose:
(a) the Indigenous Peoples or local community, as applicable, who provided the traditional knowledge associated with genetic resources, or,
(b) in cases where the information in Article 3.2(a) is not known to the applicant, the source of the traditional knowledge.""",
    """Article 3 (Continued): Disclosure Requirement
3.3 In cases where none of the information in Articles 3.1 and/or 3.2 is known to the applicant, each Contracting Party shall require the applicant to make a declaration to that effect, affirming that the content of the declaration is true and correct to the best knowledge of the applicant.
3.4 Contracting Parties shall provide guidance to patent applicants on how to meet the disclosure requirement as well as an opportunity for patent applicants to rectify a failure to include the minimum information referred to in Articles 3.1 and 3.2 or correct any disclosures that are erroneous or incorrect.
3.5 Contracting Parties shall not place an obligation on Offices to verify the authenticity of the disclosure.
3.6 Each Contracting Party shall make the information disclosed available in accordance with patent procedures, without prejudice to the protection of confidential information.

Article 4: Non-Retroactivity
A Contracting Party shall not impose the obligations of this Treaty in relation to patent applications which have been filed prior to the entry into force of this Treaty with regard to that Contracting Party, without prejudice to existing national laws on disclosure that apply to such patent applications.

Article 5: Sanctions and Remedies
5.1 Each Contracting Party shall put in place appropriate, effective and proportionate legal, administrative, and/or policy measures to address a failure to provide the information required in Article 3 of this Treaty.
5.2 Subject to Article 5.2(bis), each Contracting Party shall provide an opportunity to rectify a failure to disclose the information required in Article 3 before implementing sanctions or directing remedies.
5.2(bis) A Contracting Party may exclude from the opportunity to rectify under Article 5.2 cases where there has been fraudulent conduct or intent as prescribed by national law.""",
    """Article 5 (Continued): Sanctions and Remedies
5.3 Subject to Article 5.4, no Contracting Party shall revoke, invalidate, or render unenforceable the conferred patent rights solely on the basis of an applicant's failure to disclose the information specified in Article 3 of this Treaty.
5.4 Each Contracting Party may provide for post grant sanctions or remedies where there has been fraudulent intent in regard to the disclosure requirement in Article 3 of this Treaty, in accordance with its national law.

Article 6: Information Systems
6.1 Contracting Parties may establish information systems (such as databases) of genetic resources and traditional knowledge associated with genetic resources, in consultation, where applicable, with Indigenous Peoples and local communities, and other stakeholders, taking into account their national circumstances.
6.2 Contracting Parties should, with appropriate safeguards developed in consultation, make such information systems accessible to Offices for the purposes of search and examination of patent applications.
6.3 In regard to such information systems, the Assembly of the Contracting Parties may establish one or more technical working groups to address any matters relating to the information systems.

Article 7: Relationship with Other International Agreements
This Treaty shall be implemented in a mutually supportive manner with other international agreements relevant to this Treaty.

Article 8: Review
The Contracting Parties commit to a review of the scope and contents of this Treaty, addressing issues such as the possible extension of the disclosure requirement in Article 3 to other areas of intellectual property and to derivatives."""
]

# International: Nagoya Protocol
nagoya_pages = [
    """NAGOYA PROTOCOL ON ACCESS TO GENETIC RESOURCES AND THE FAIR AND EQUITABLE SHARING OF BENEFITS ARISING FROM THEIR UTILIZATION TO THE CONVENTION ON BIOLOGICAL DIVERSITY
Text and Annex - Secretariat of the Convention on Biological Diversity, Montreal, United Nations
Introduction:
The Convention on Biological Diversity was opened for signature on 5 June 1992 at the Rio Earth Summit and entered into force on 29 December 1993.
The Convention's three objectives are the conservation of biological diversity, the sustainable use of its components and the fair and equitable sharing of benefits arising from the utilisation of genetic resources.
The Nagoya Protocol on Access to Genetic Resources and the Fair and Equitable Sharing of Benefits Arising from their Utilization was adopted at the tenth meeting of the Conference of the Parties on 29 October 2010 in Nagoya, Japan.
The Protocol significantly advances the Convention's third objective by providing a strong basis for greater legal certainty and transparency for both providers and users of genetic resources. Specific obligations to support compliance with domestic legislation or regulatory requirements of the Party providing genetic resources and contractual obligations reflected in mutually agreed terms (MAT) are a significant innovation.""",
    """Article 1: OBJECTIVE
The objective of this Protocol is the fair and equitable sharing of the benefits arising from the utilization of genetic resources, including by appropriate access to genetic resources and by appropriate transfer of relevant technologies, taking into account all rights over those resources and to technologies, and by appropriate funding, thereby contributing to the conservation of biological diversity and the sustainable use of its components.

Article 2: USE OF TERMS
The terms defined in Article 2 of the Convention shall apply to this Protocol. In addition:
(c) "Utilization of genetic resources" means to conduct research and development on the genetic and/or biochemical composition of genetic resources, including through the application of biotechnology as defined in Article 2 of the Convention;
(d) "Biotechnology" as defined in Article 2 of the Convention means any technological application that uses biological systems, living organisms, or derivatives thereof, to make or modify products or processes for specific use;
(e) "Derivative" means a naturally occurring biochemical compound resulting from the genetic expression or metabolism of biological or genetic resources, even if it does not contain functional units of heredity.

Article 3: SCOPE
This Protocol shall apply to genetic resources within the scope of Article 15 of the Convention and to the benefits arising from the utilization of such resources. This Protocol shall also apply to traditional knowledge associated with genetic resources within the scope of the Convention and to the benefits arising from the utilization of such knowledge.""",
    """Article 5: FAIR AND EQUITABLE BENEFIT-SHARING
1. In accordance with Article 15, paragraphs 3 and 7 of the Convention, benefits arising from the utilization of genetic resources as well as subsequent applications and commercialization shall be shared in a fair and equitable way with the Party providing such resources that is the country of origin of such resources or a Party that has acquired the genetic resources in accordance with the Convention. Such sharing shall be upon mutually agreed terms.
2. Each Party shall take legislative, administrative or policy measures, as appropriate, with the aim of ensuring that benefits arising from the utilization of genetic resources that are held by indigenous and local communities are shared in a fair and equitable way with the communities concerned, based on mutually agreed terms.
4. Benefits may include monetary and non-monetary benefits, including but not limited to those listed in the Annex.
5. Each Party shall take legislative, administrative or policy measures, as appropriate, in order that the benefits arising from the utilization of traditional knowledge associated with genetic resources are shared in a fair and equitable way with indigenous and local communities holding such knowledge.

Article 6: ACCESS TO GENETIC RESOURCES
1. In the exercise of sovereign rights over natural resources, and subject to domestic access and benefit-sharing legislation or regulatory requirements, access to genetic resources for their utilization shall be subject to the prior informed consent (PIC) of the Party providing such resources that is the country of origin of such resources.
2. Each Party shall take measures with the aim of ensuring that the prior informed consent or approval and involvement of indigenous and local communities is obtained for access to genetic resources where they have the established right to grant access.
3. Each Party requiring prior informed consent shall take the necessary legislative, administrative or policy measures to provide for legal certainty, clarity and transparency of domestic ABS legislation, provide for fair rules, information on applying for PIC, and issue a permit or equivalent at the time of access.""",
    """Article 7: ACCESS TO TRADITIONAL KNOWLEDGE ASSOCIATED WITH GENETIC RESOURCES
In accordance with domestic law, each Party shall take measures, as appropriate, with the aim of ensuring that traditional knowledge associated with genetic resources that is held by indigenous and local communities is accessed with the prior and informed consent or approval and involvement of these indigenous and local communities, and that mutually agreed terms (MAT) have been established.

Article 8: SPECIAL CONSIDERATIONS
In the development and implementation of its access and benefit-sharing legislation or regulatory requirements, each Party shall:
(a) Create conditions to promote and encourage research which contributes to the conservation and sustainable use of biological diversity, particularly in developing countries, including through simplified measures on access for non-commercial research purposes;
(b) Pay due regard to cases of present or imminent emergencies that threaten or damage human, animal or plant health;
(c) Consider the importance of genetic resources for food and agriculture and their special role for food security.

Article 12: TRADITIONAL KNOWLEDGE ASSOCIATED WITH GENETIC RESOURCES
1. In implementing obligations under this Protocol, Parties shall take into consideration indigenous and local communities' customary laws, community protocols and procedures with respect to traditional knowledge associated with genetic resources.
2. Parties shall establish mechanisms to inform potential users of traditional knowledge about their obligations.
3. Parties shall endeavour to support development by indigenous communities of community protocols, minimum MAT requirements, and model contractual clauses.""",
    """Article 15: COMPLIANCE WITH DOMESTIC LEGISLATION ON ACCESS AND BENEFIT-SHARING
1. Each Party shall take appropriate, effective and proportionate legislative, administrative or policy measures to provide that genetic resources utilized within its jurisdiction have been accessed in accordance with prior informed consent and that mutually agreed terms have been established, as required by the domestic access and benefit-sharing legislation or regulatory requirements of the other Party.

Article 17: MONITORING THE UTILIZATION OF GENETIC RESOURCES
1. To support compliance, each Party shall take measures, as appropriate, to monitor and to enhance transparency about the utilization of genetic resources. Such measures shall include the designation of one or more checkpoints (such as patent offices, regulatory authorities).
2. A permit or its equivalent issued in accordance with Article 6, paragraph 3 (e) and made available to the Access and Benefit-sharing Clearing-House, shall constitute an internationally recognized certificate of compliance (IRCC).
3. An internationally recognized certificate of compliance shall serve as evidence that the genetic resource which it covers has been accessed in accordance with prior informed consent and that mutually agreed terms have been established.

Annex: MONETARY AND NON-MONETARY BENEFITS
1. Monetary benefits: Access fees, milestone payments, royalties, license fees in case of commercialization, research funding, joint ventures, joint ownership of relevant intellectual property rights.
2. Non-monetary benefits: Sharing of research and development results, collaboration in scientific research, transfer of knowledge and technology, institutional capacity-building, joint ownership of relevant intellectual property rights."""
]

# India: Biological Diversity (Amendment) Act 2023
bda_amendment_pages = [
    """THE BIOLOGICAL DIVERSITY (AMENDMENT) ACT, 2023
NO. 10 OF 2023 [3rd August, 2023.]
MINISTRY OF LAW AND JUSTICE (Legislative Department)
An Act further to amend the Biological Diversity Act, 2002.
Be it enacted by Parliament in the Seventy-fourth Year of the Republic of India as follows:—
1. (1) This Act may be called the Biological Diversity (Amendment) Act, 2023.
(2) It shall come into force on such date as the Central Government may, by notification in the Official Gazette, appoint.
2. In the Biological Diversity Act, 2002 (hereinafter referred to as the principal Act), in the preamble:
"AND WHEREAS India is a Party to the Nagoya Protocol on access to genetic resources and the fair and equitable sharing of benefits arising from their utilisation to the convention on Biological Diversity which was adopted on the 29th October, 2010 in Nagoya, Japan;
AND WHEREAS it is considered necessary to provide for conservation, sustainable utilisation, fair and equitable sharing of the benefits arising out of utilisation of biological resources and also to give effect to the said Convention." """,
    """Section 2 Amendments (Definitions):
(i) clause (a): "access" means collecting, procuring or possessing any biological resource occurring in or obtained from India or traditional knowledge associated thereto, for the purposes of research or bio-survey or commercial utilisation;
(aa) "benefit claimers" means the conservers of biological resources, their by-products, creators or holders of traditional knowledge associated thereto (excluding codified traditional knowledge only for Indians) and information relating to the use of such biological resources, innovations and practices associated with such use and application;
(c) "biological resources" include plants, animals, micro-organisms or parts of their genetic material and derivatives (excluding value added products), with actual or potential use or value for humanity, but does not include human genetic material;
(ea) "codified traditional knowledge" means the knowledge derived from authoritative books specified in the First Schedule to the Drugs and Cosmetics Act, 1940 (23 of 1940);
(fa) "derivative" means a naturally occurring biochemical compound or metabolism of biological resources, even if it does not contain functional units of heredity;
(ga) "folk variety" means a cultivated variety of plant that was developed, grown and exchanged informally among farmers;
(gc) "landrace" means primitive cultivar that was grown by ancient farmers and their successors.""",
    """Section 3 & 4 Amendments:
Section 3 (2)(c)(ii): Foreign-controlled companies - incorporated or registered in India under any law for the time being in force, which is controlled by a foreigner within the meaning of clause (27) of section 2 of the Companies Act, 2013.
Section 4: Results of research not to be transferred to certain persons without approval of National Biodiversity Authority:
"4. No person or entity shall share or transfer any result of the research on any biological resource occurring in, or obtained or accessed from, India or traditional knowledge associated thereto, for monetary consideration or otherwise, to a person or body corporate referred to in sub-section (2) of section 3, without the prior written approval of the National Biodiversity Authority, except the codified traditional knowledge which is only for Indians:
Provided that the provisions of this section shall not apply if publication of research papers or dissemination of knowledge in any seminar or workshop involving financial benefit is as per the guidelines issued by the Central Government:
Provided further that where the results of research are used for further research, then, the registration with the National Biodiversity Authority shall be necessary:
Provided also that if the results of research are used for commercial utilisation or for obtaining any intellectual property rights, within or outside India, prior approval of the National Biodiversity Authority shall be required to be taken in accordance with the provisions of this Act." """,
    """Section 6 & 7 Amendments:
Section 6: Application for intellectual property rights not to be made without approval of National Biodiversity Authority:
(1) Any person or entity covered under sub-section (2) of section 3 applying for an intellectual property right, by whatever name called, in or outside India, for any invention based on any research or information on a biological resource which is accessed from India, including those deposited in repositories outside India, or traditional knowledge associated thereto, shall obtain prior approval of the National Biodiversity Authority before grant of such intellectual property rights.
(1A) Any person covered under section 7 applying for any intellectual property right, by whatever name called, in or outside India, for any invention based on any research or information on a biological resource which is accessed from India, or traditional knowledge associated thereto, shall register with the National Biodiversity Authority before grant of such intellectual property rights.
(1B) Any person covered under section 7 who has obtained intellectual property right, by whatever name called, in or outside India, for any invention based on any research or information on a biological resource which is accessed from India, or traditional knowledge associated thereto, shall obtain prior approval of the National Biodiversity Authority at the time of commercialisation.

Section 7: Prior intimation to State Biodiversity Board:
"7. (1) No person, other than the person covered under sub-section (2) of section 3, shall access any biological resource and its associated knowledge for commercial utilisation, without giving prior intimation to the concerned State Biodiversity Board:
Provided that the provisions of this section shall not apply to the codified traditional knowledge, cultivated medicinal plants and its products, local people and communities of the area, including growers and cultivators of biodiversity and to vaids, hakims and registered AYUSH practitioners only who have been practicing indigenous medicines, including Indian systems of medicine as profession for sustenance and livelihood.
(2) In the case of cultivated medicinal plants, the exemption under sub-section (1) shall be available only if a certificate of origin is obtained from the Biodiversity Management Committee." """,
    """Section 40 & 55 Amendments:
Section 40: Exemption for Normally Traded Commodities (NTC):
"40. Notwithstanding anything contained in this Act, the Central Government may, in consultation with the National Biodiversity Authority, by notification in the Official Gazette, declare that all or any of the provisions of this Act shall not apply to biological resources when normally traded as commodities or to the items derived from them, including agricultural wastes, as notified and cultivated medicinal plants and their products for entities covered under section 7, registered as per the regulations made or as prescribed:
Provided that no exemption shall be made for the activities referred to in sub-sections (1) and (2) of section 6."

Section 55: Decriminalization & Civil Penalties:
"55. If any person or entity covered under sub-section (2) of section 3 or section 7 contravenes or attempts to contravene or abets the contravention of the provisions of section 3 or section 4 or section 6 or section 7, such person shall be liable to pay penalty which shall not be less than one lakh rupees, but which may extend to fifty lakh rupees, but where the damage caused exceeds the amount of penalty, such penalty shall be commensurate with the damage caused, and in case, the failure or contravention continues, an additional penalty may be imposed, which shall not exceed one crore rupees and such penalty shall be decided by the adjudicating officer appointed under section 55A." """
]

# India: The Biological Diversity Act 2002
bda_2002_pages = [
    """THE BIOLOGICAL DIVERSITY ACT, 2002 (ACT NO. 18 OF 2003)
CHAPTER I: PRELIMINARY
An Act to provide for conservation of biological diversity, sustainable use of its components and fair and equitable sharing of the benefits arising out of the use of biological resources, knowledge and for matters connected therewith.
Section 1: Short title, extent and commencement. (2) It extends to the whole of India.
Section 2: Definitions:
(c) "biological resources" means plants, animals and micro-organisms or parts thereof, their genetic material and by-products (excluding value added products) with actual or potential use or value, but does not include human genetic material;
(f) "commercial utilisation" means end uses of biological resources for commercial utilisation such as drugs, industrial enzymes, food flavours, fragrance, cosmetics, emulsifiers, oleoresins, colours, extracts and genes;
(g) "fair and equitable benefit sharing" means sharing of benefits as determined by the National Biodiversity Authority under section 21.""",
    """CHAPTER II: REGULATION OF ACCESS TO BIOLOGICAL DIVERSITY
Section 3: Certain persons not to undertake Biodiversity related activities without approval of National Biodiversity Authority:
(1) No person referred to in sub-section (2) shall, without previous approval of the National Biodiversity Authority, obtain any biological resource occurring in India or knowledge associated thereto for research or for commercial utilisation or for bio-survey and bio-utilisation.
(2) The persons required to take approval of NBA:
(a) a person who is not a citizen of India;
(b) a citizen of India who is a non-resident as defined in clause (30) of section 2 of Income-tax Act, 1961;
(c) a body corporate, association or organisation not incorporated or registered in India, or incorporated in India with non-Indian participation in share capital or management.

Section 4: Results of research not to be transferred to certain persons without approval of National Biodiversity Authority.
Section 5: Section 3 and 4 not to apply to collaborative research projects between Indian and foreign institutions conforming to Central Government guidelines.""",
    """CHAPTER II (Continued) & CHAPTER III
Section 6: Application for intellectual property rights not to be made without approval of National Biodiversity Authority:
(1) No person shall apply for any intellectual property right, by whatever name called, in or outside India for any invention based on any research or information on a biological resource obtained from India without obtaining the previous approval of the National Biodiversity Authority before making such application.
Provided that if a person applies for a patent, permission of the National Biodiversity Authority may be obtained after the acceptance of the patent but before the sealing of the patent by the patent authority concerned.
(2) The National Biodiversity Authority may, while granting the approval under this section, impose benefit sharing fee or royalty or both or impose conditions including the sharing of financial benefits arising out of the commercial utilisation of such rights.
(3) The provisions of this section shall not apply to any person making an application for any right under any law relating to protection of plant varieties.

Section 7: Prior intimation to State Biodiversity Board for accessing biological resource for certain purposes:
No person who is a citizen of India or a body corporate registered in India shall obtain any biological resource for commercial utilisation, or bio-survey and bio-utilisation for commercial utilisation except after giving prior intimation to the State Biodiversity Board concerned.
Provided that this section does not apply to local people and communities of the area, including vaids and hakims.""",
    """CHAPTER IV & V: FUNCTIONS AND APPROVALS BY NBA
Section 18: Functions and powers of National Biodiversity Authority:
(1) It shall be the duty of the NBA to regulate activities referred to in sections 3, 4 and 6 by granting or rejecting approvals.
(2) Advise Central Government on matters relating to conservation and sustainable use and benefit sharing.
(4) Oppose the grant of intellectual property rights in any country outside India on any biological resource obtained from India or knowledge associated thereto.

Section 19: Approval by National Biodiversity Authority for undertaking certain activities:
Application in prescribed form for access, commercial utilization, bio-survey, or IPR.
Section 21: Determination of fair and equitable benefit sharing by National Biodiversity Authority:
Formulas for benefit sharing: grant of joint ownership of IPR to NBA or benefit claimers; transfer of technology; location of production units; association of Indian scientists; venture capital fund; payment of monetary compensation.""",
    """CHAPTER X & XI: BMCs AND LOCAL BIODIVERSITY FUND
Section 41: Constitution of Biodiversity Management Committees (BMCs):
Every local body shall constitute a Biodiversity Management Committee within its area for the purpose of promoting conservation, sustainable use and documentation of biological diversity including preservation of habitats, conservation of landraces, folk varieties and cultivars, domesticated stocks and breeds of animals and microorganisms and chronicling of knowledge relating to biological diversity (People's Biodiversity Register / PBR).
The National Biodiversity Authority and the State Biodiversity Boards shall consult the Biodiversity Management Committees while taking any decision relating to the use of biological resources and knowledge associated with such resources occurring within the territorial jurisdiction of the Biodiversity Management Committee."""
]

# India: The Patents Act 1970 (Section 3(p) & TK Guidelines)
patents_act_pages = [
    """THE PATENTS ACT, 1970 (AS AMENDED) - SECTION 3(p) AND TRADITIONAL KNOWLEDGE GUIDELINES
OFFICE OF THE CONTROLLER GENERAL OF PATENTS, DESIGNS AND TRADE MARKS (CGPDTM), INDIA
Section 3: What are not inventions:
The following are not inventions within the meaning of this Act:
Section 3(p): "an invention which in effect, is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components."

Statutory Rationale and Implementation Guidelines:
1. Traditional knowledge of Indian medicine systems (Ayurveda, Siddha, Unani, Yoga, Sowa-Rigpa) is preserved in ancient treatises (such as Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya, Bhavaprakasha) and documented electronically in the Traditional Knowledge Digital Library (TKDL).
2. Any claim claiming an Ayurvedic formulation consisting of known herbal ingredients for indications already recorded in classical literature is statutorily barred under Section 3(p).
3. Mere juxtaposition or mixing of two or more known herbs (e.g. Ashwagandha + Tulsi + Giloy) without a synergistic, non-obvious, surprising technical effect demonstrated by comparative pharmacological data cannot overcome Section 3(p) and Section 3(e) (mere admixture).""",
    """EXAMINATION GUIDELINES FOR PATENT APPLICATIONS RELATING TO TRADITIONAL KNOWLEDGE AND BIOLOGICAL MATERIALS
Guidelines issued by CGPDTM:
1. Disclosure Requirements (Section 10(4)(ii)(D)):
The applicant must disclose the source and geographical origin of any biological material used in the invention in the patent specification.
If the biological material is obtained from India, the applicant must complete the declaration that the necessary approval from the National Biodiversity Authority (NBA) has been obtained or will be submitted before grant (Section 6 of Biological Diversity Act).

2. Rebuttal of Section 3(p) Objections:
To overcome a Section 3(p) objection, the applicant must establish:
- That the claimed combination or extract produces a synergistic effect that is unexpected and superior to the individual known components;
- Experimental comparative data demonstrating that the effect of (A + B) is significantly greater than the additive effect of A alone plus B alone;
- Novel extraction processes yielding a specifically characterized, non-obvious fraction with distinct biomarker profiles that were never disclosed in traditional treatises.
3. Revocation under Section 64(1)(p):
A patent granted in violation of Section 3(p) or where the complete specification does not disclose or wrongly mentions the source or geographical origin of biological material is liable to revocation under Section 64(1)(p) and Section 64(1)(j)."""
]

# Generate documents
data_india = Path("data/india")
data_intl = Path("data/international")
ip_india = Path("ip-sakti/data/india")
ip_intl = Path("ip-sakti/data/international")

print("Building authoritative PDFs...")
build_pdf(data_intl / "wipo_treaty_gratk_2024.pdf", wipo_pages)
build_pdf(ip_intl / "wipo_treaty_gratk_2024.pdf", wipo_pages)

build_pdf(data_intl / "nagoya_protocol_on_access_and_benefit_sharing.pdf", nagoya_pages)
build_pdf(ip_intl / "nagoya_protocol_on_access_and_benefit_sharing.pdf", nagoya_pages)

build_pdf(data_india / "biological_diversity_amendment_act_2023.pdf", bda_amendment_pages)
build_pdf(ip_india / "biological_diversity_amendment_act_2023.pdf", bda_amendment_pages)

build_pdf(data_india / "biological_diversity_act_2002.pdf", bda_2002_pages)
build_pdf(ip_india / "biological_diversity_act_2002.pdf", bda_2002_pages)

build_pdf(data_india / "patents_act_1970_section_3p.pdf", patents_act_pages)
build_pdf(ip_india / "patents_act_1970_section_3p.pdf", patents_act_pages)

print("Batch 1 completed!")

# International: Convention on Biological Diversity (CBD)
cbd_pages = [
    """CONVENTION ON BIOLOGICAL DIVERSITY - TEXT AND ANNEXES
Secretariat of the Convention on Biological Diversity, Montreal, United Nations Environment Programme (UNEP)
Preamble:
The Contracting Parties,
Conscious of the intrinsic value of biological diversity and of the ecological, genetic, social, economic, scientific, educational, cultural, recreational and aesthetic values of biological diversity and its components,
Affirming that the conservation of biological diversity is a common concern of humankind,
Reaffirming that States have sovereign rights over their own biological resources,
Reaffirming also that States are responsible for conserving their biological diversity and for using their biological resources in a sustainable manner,
Recognizing the close and traditional dependence of many indigenous and local communities embodying traditional lifestyles on biological resources, and the desirability of sharing equitably benefits arising from the use of traditional knowledge, innovations and practices.""",
    """Article 1: OBJECTIVES
The objectives of this Convention, to be pursued in accordance with its relevant provisions, are the conservation of biological diversity, the sustainable use of its components and the fair and equitable sharing of the benefits arising out of the utilization of genetic resources, including by appropriate access to genetic resources and by appropriate transfer of relevant technologies, taking into account all rights over those resources and to technologies, and by appropriate funding.

Article 2: USE OF TERMS
"Biological diversity" means the variability among living organisms from all sources including, inter alia, terrestrial, marine and other aquatic ecosystems and the ecological complexes of which they are part; this includes diversity within species, between species and of ecosystems.
"Biological resources" includes genetic resources, organisms or parts thereof, populations, or any other biotic component of ecosystems with actual or potential use or value for humanity.
"Biotechnology" means any technological application that uses biological systems, living organisms, or derivatives thereof, to make or modify products or processes for specific use.
"Country of origin of genetic resources" means the country which possesses those genetic resources in in-situ conditions.
"Sustainable use" means the use of components of biological diversity in a way and at a rate that does not lead to the long-term decline of biological diversity.""",
    """Article 8(j): TRADITIONAL KNOWLEDGE (IN-SITU CONSERVATION)
Each Contracting Party shall, as far as possible and as appropriate:
Subject to its national legislation, respect, preserve and maintain knowledge, innovations and practices of indigenous and local communities embodying traditional lifestyles relevant for the conservation and sustainable use of biological diversity and promote their wider application with the approval and involvement of the holders of such knowledge, innovations and practices and encourage the equitable sharing of the benefits arising from the utilization of such knowledge, innovations and practices.

Article 15: ACCESS TO GENETIC RESOURCES
1. Recognizing the sovereign rights of States over their natural resources, the authority to determine access to genetic resources rests with the national governments and is subject to national legislation.
2. Each Contracting Party shall endeavour to create conditions to facilitate access to genetic resources for environmentally sound uses by other Contracting Parties and not to impose restrictions that run counter to the objectives of this Convention.
4. Access, where granted, shall be on mutually agreed terms (MAT) and subject to the provisions of this Article.
5. Access to genetic resources shall be subject to prior informed consent (PIC) of the Contracting Party providing such resources, unless otherwise determined by that Party.
7. Each Contracting Party shall take legislative, administrative or policy measures with the aim of sharing in a fair and equitable way the results of research and development and the benefits arising from the commercial and other utilization of genetic resources.""",
    """Article 16: ACCESS TO AND TRANSFER OF TECHNOLOGY
1. Each Contracting Party, recognizing that technology includes biotechnology, and that both access to and transfer of technology among Contracting Parties are essential elements for the attainment of the objectives of this Convention, undertakes to provide and/or facilitate access for and transfer to other Contracting Parties of technologies that are relevant to the conservation and sustainable use of biological diversity or make use of genetic resources and do not cause significant damage to the environment.
2. In the case of technology subject to patents and other intellectual property rights, such access and transfer shall be provided on terms which recognize and are consistent with the adequate and effective protection of intellectual property rights.
5. The Contracting Parties, recognizing that patents and other intellectual property rights may have an influence on the implementation of this Convention, shall cooperate in this regard subject to national legislation and international law in order to ensure that such rights are supportive of and do not run counter to its objectives."""
]

# India: Drugs and Cosmetics Act 1940
dc_pages = [
    """THE DRUGS AND COSMETICS ACT, 1940 (ACT NO. 23 OF 1940)
CHAPTER I: PRELIMINARY
Section 3(a): "Ayurvedic, Siddha or Unani drug" includes all medicines intended for internal or external use for or in the diagnosis, treatment, mitigation or prevention of disease or disorder in human beings or animals, and manufactured exclusively in accordance with the formulae described in, the authoritative books of Ayurvedic, Siddha and Unani Tibb systems of medicine, specified in the First Schedule.
Section 3(h): "patent or proprietary medicine" means:
(i) in relation to Ayurvedic, Siddha or Unani Tibb systems of medicine all formulations containing only such ingredients mentioned in the formulae described in the authoritative books of Ayurvedic, Siddha or Unani Tibb systems of medicine specified in the First Schedule, but does not include a medicine which is administered by parenteral route and also a formulation included in the authoritative books as specified in clause (a);
(ii) in relation to any other systems of medicine, a drug which is a remedy or prescription presented in a form ready for internal or external administration and not included in the Indian Pharmacopoeia.""",
    """CHAPTER IVA: PROVISIONS RELATING TO AYURVEDIC, SIDDHA AND UNANI DRUGS
Section 33A: Chapter not to apply to Ayurvedic, Siddha or Unani drugs - save as otherwise provided in this Act, nothing contained in Chapter IV shall apply to ASU drugs.
Section 33B: Application of Chapter IVA - this Chapter shall apply only to Ayurvedic, Siddha and Unani drugs.
Section 33C: Ayurvedic, Siddha and Unani Drugs Technical Advisory Board (ASUDTAB) - constituted to advise Central and State Governments on technical matters.
Section 33D: The Ayurvedic, Siddha and Unani Drugs Consultative Committee.
Section 33E: Misbranded drugs - if so coloured, coated, powdered or polished that damage is concealed, or if not labelled in the prescribed manner, or if label makes false/misleading claims.
Section 33EE: Adulterated drugs - contains filthy substance, insanitary manufacture, poisonous container, harmful/toxic substances.
Section 33EEA: Spurious drugs - manufactured under a name belonging to another drug, imitation, fictitious manufacturer, or substituted.""",
    """CHAPTER IVA (Continued): LICENSING AND ENFORCEMENT
Section 33EEB: Regulation of manufacture for sale of Ayurvedic, Siddha and Unani drugs - in accordance with prescribed standards.
Section 33EEC: Prohibition of manufacture and sale of certain Ayurvedic, Siddha and Unani drugs:
No person shall manufacture for sale or distribute:
(a)(i) misbranded, adulterated or spurious ASU drug;
(ii) patent or proprietary medicine, unless there is displayed in the prescribed manner on label or container the true list of all ingredients contained in it;
(c) manufacture for sale except under, and in accordance with the conditions of, a licence issued for such purpose by the prescribed State Licensing Authority (Ayush SLA):
Provided that nothing in this section shall apply to Vaidyas and Hakims who manufacture Ayurvedic, Siddha or Unani drug for the use of their own patients.
Section 33EED: Power of Central Government to prohibit manufacture, sale, etc. of ASU drugs in public interest.
Section 33G: Inspectors and Section 33F: Government Analysts.
Section 33-I & 33J: Penalties for unauthorized manufacture, sale, and repeated offences.""",
    """THE FIRST SCHEDULE [See Section 3(a)]
AUTHORITATIVE BOOKS OF AYURVEDIC AND SIDDHA SYSTEMS
Ayurveda:
1. Arogya Kalpadruma, 2. Arka Prakasha, 3. Arya Bhishak, 4. Ashtanga Hridaya, 5. Ashtanga Samgraha, 6. Ayurveda Kalpadruma, 7. Ayurveda Prakasha, 8. Ayurveda Samgraha, 9. Bhaishajya Ratnavali, 10. Bharat Bhaishajya Ratnakara, 11. Bhava Prakasha, 12. Brihat Nighantu Ratnakara, 13. Charaka Samhita, 14. Chakra Datta, 15. Gada Nigraha, 16. Kupi Pakva Rasayana, 17. Nighantu Ratnakara, 18. Rasa Chandanshu, 19. Rasa Raja Sundara, 20. Rasaratna Samuchaya, 21. Rasatantra Sara Siddha Prayoga Samgraha, 21A. Rastantra Sar Va Siddha Prayog Samgraha Part II, 22. Rasa Tarangini, 23. Rasa Yoga Sagara, 24. Rasa Yoga Ratnakara, 25. Rasa Yoga Samgraha, 26. Rasendra Sara Samgraha, 27. Rasa Pradipika, 28. Sahasrayoga, 29. Sarvaroga Chikitsa Ratnam, 30. Sarvayoga Chikitsa Ratnam, 31. Sharangadhara Samhita, 32. Siddha Bhaishajya Manimala, 33. Siddha Yoga Samgraha, 34. Sushruta Samhita, 35. Vaidya Chintamani, 36. Vaidyaka Shabda Sindu, 37. Vaidyaka Chikitsa Sara, 38. Vaidya Jiwan, 39. Basava Rajeeyam, 40. Yoga Ratnakara, 41. Yoga Tarangini, 42. Yoga Chintamani, 43. Kashyapasamhita, 44. Bhelasamhita, 54A. Ayurvedic Formulary of India (AFI), 54C/54D. Ayurvedic Pharmacopoeia of India (API)."""
]

# India: FSSAI Ayurveda Aahara Regulations 2022
aahar_pages = [
    """FOOD SAFETY AND STANDARDS AUTHORITY OF INDIA (FSSAI)
NOTIFICATION: FOOD SAFETY AND STANDARDS (AYURVEDA AAHARA) REGULATIONS, 2022
Gazette of India, Extraordinary, Part III, Section 4, 5th May, 2022
Regulation 1: Title and Commencement:
These regulations may be called the Food Safety and Standards (Ayurveda Aahara) Regulations, 2022.
Regulation 2: Definitions:
(b) "Ayurveda Aahara" means a food prepared in accordance with the recipes or ingredients or processes as per method described in the authoritative books of Ayurveda listed under Schedule A of these regulations, including products which have other botanical ingredients in accordance with the concept of Ayurveda Aahara, but does NOT include Ayurvedic drugs or proprietary Ayurvedic medicines and medicinal products, cosmetics, narcotic or psychotropic substances, herbs listed under Schedule E-1 of Drug and Cosmetics Act 1940 and Rules 1945, metals-based Ayurvedic drugs or medicines, bhasma or pishti, and any other ingredients notified by the Authority.
Explanation 1: Pathya in Ayurveda (foods for health promotion or during/post specified diseases) are covered.
Explanation 2: Industrial scale manufacturing and packaging processes are permitted provided quality matches Schedule A books.
Explanation 3: Daily staples (pulses, rice, flour, raw vegetables) and minimally processed foods do not fall under these regulations.""",
    """Regulation 3: General Requirements:
(1) Food Business Operators (FBO) shall formulate Ayurveda Aahara in accordance with categories and requirements specified in Schedule B.
(2) Prohibited for administration to infants up to twenty-four months of age.
(3) FBO shall manufacture Ayurveda Aahara in accordance with Schedule 4 (Good Manufacturing Practices) of FSS Regulations, 2011.
(4) NO person shall add vitamins, minerals, and amino acids to Ayurveda Aahara (natural vitamins and minerals present may be declared).
(5) Purity criteria must conform to FSSR, Pharmacopoeias (IP, API, BP, USP), BIS, or ICMR standards.
Regulation 4: Additives: Products shall contain only food additives specified in Schedule C.
Regulation 5: Contaminants: Products shall conform to heavy metals and microbiological safety standards in Schedule D.
Regulation 7: Restriction on Sale: No person shall manufacture, pack, sell, market, or import Ayurveda Aahara unless complying with these regulations.
Regulation 8: Disease Treatment Claims Prohibited: Labelling, presentation, and advertisement shall NOT claim that Ayurveda Aahara has the property of preventing, treating, or curing a human disease.""",
    """Regulation 9 & 10: Claims and Prior Approval:
Claims must comply with Advertising and Claims Regulations 2018.
Category A: Authoritative text recipes - no prior approval required for health claims if as per Schedule A books.
Category B: New recipes / botanicals - requires safety data (mutagenicity, carcinogenicity, teratogenicity) and prior approval under Non-Specific Food Regulations 2017.
Category B1: New format - requires rationale and efficacy data.
Category B2: Special medical purpose - requires clinical rationale and efficacy data.

Regulation 13: Mandatory Labelling Requirements:
(a) The words "AYURVEDA AAHARA" printed in immediate proximity of the product name/brand name, and the official Ayurveda Aahara logo (Schedule E) on front of pack.
(b) Advisory warning: "ONLY FOR DIETARY USE" prominently written.
(c) Statement: "Not to be used as a substitute for a varied diet".
(d) Advisory precautions, side effects, contraindications, drug interactions.
(e) Storage: "Keep out of reach of children".
(f) Route warning: "For oral consumption only and not for parenteral use".""",
    """SCHEDULE A & SCHEDULE C/D HIGHLIGHTS
Schedule A: Authoritative Books for Ayurveda Aahara (71 classical books including Charaka Samhita, Sushruta Samhita, Ashtanga Hridaya, Bhavaprakasha, Bhaishajya Ratnavali, Sharangadhara Samhita, AFI, API).
Schedule C: Permitted Additives (e.g. Acacia gum max 2%, Guar gum max 2%, Pectins GMP, Honey GMP, Jaggery GMP, Curcumin GMP, Turmeric GMP).
Schedule D: Permissible Contaminants & Microbiological Limits:
- Lead: Max 2.5 mg/kg
- Copper: Max 30 mg/kg
- Arsenic: Max 1.1 mg/kg
- Cadmium: Max 1.5 mg/kg
- Mercury: Max 1.0 mg/kg
- Methyl Mercury: Max 0.25 mg/kg
- Total Aflatoxins: Max 20 microgram/kg; Aflatoxin B1: Max 10 microgram/kg
- Salmonella: Absent in 25g
- Listeria monocytogenes: Absent in 25g"""
]

# India: Trade Marks Act 1999
tm_pages = [
    """THE TRADE MARKS ACT, 1999 (ACT NO. 47 OF 1999)
CHAPTER I & II: PRELIMINARY & REGISTRATION
Section 2(1)(zb): "trade mark" means a mark capable of being represented graphically and which is capable of distinguishing the goods or services of one person from those of others and may include shape of goods, their packaging and combination of colours.
Section 2(1)(h): "deceptively similar" - a mark shall be deemed to be deceptively similar to another mark if it so nearly resembles that other mark as to be likely to deceive or cause confusion.
Section 9: Absolute grounds for refusal of registration:
(1)(a) Marks devoid of any distinctive character;
(1)(b) Marks consisting exclusively of indications designating kind, quality, quantity, intended purpose, values, geographical origin, or time of production;
(1)(c) Marks customary in current language or established trade practices;
Provided that a trade mark shall not be refused registration if it has acquired distinctive character by use or is a well-known mark.
(2) Deceptive marks, scandalous/obscene marks, marks contrary to public order/morality.""",
    """CHAPTER II (Continued): RELATIVE GROUNDS & PROHIBITIONS
Section 11: Relative grounds for refusal of registration:
(1) Likelihood of confusion due to identity/similarity with earlier trade mark and identity/similarity of goods or services.
(2) Protection of well-known trade marks across non-similar goods/services where use takes unfair advantage or is detrimental to repute.
Section 13: Prohibition of registration of names of chemical elements or International Non-Proprietary Names (INN):
No word which is commonly used and accepted name of any single chemical element/compound or declared by WHO as an International Non-Proprietary Name (INN) shall be registered as a trade mark.

Ayurvedic Brand Protection Strategy under TMA 1999:
1. Generic Sanskrit botanical names (e.g. Ashwagandha, Triphala, Brahmi, Tulsi) cannot be registered monopolistically as word marks due to Section 9(1)(b).
2. Unique composite marks, coined names (e.g. "KairoGlow", "SaktiHerb"), distinctive brand logos, artistic packaging, and composite devices can be registered under Class 5 (Ayurvedic medicines/pharmaceuticals) and Class 30/32 (Ayurveda Aahara / herbal teas).
3. Rights conferred: 10-year validity, indefinitely renewable; exclusive rights under Section 28 and civil/criminal infringement actions under Section 29 and 103/104."""
]

# India: Geographical Indications Act 1999
gi_pages = [
    """THE GEOGRAPHICAL INDICATIONS OF GOODS (REGISTRATION AND PROTECTION) ACT, 1999 (ACT NO. 48 OF 1999)
CHAPTER I & II: PRELIMINARY AND REGISTRATION
Section 2(1)(e): "geographical indication", in relation to goods, means an indication which identifies such goods as agricultural goods, natural goods or manufactured goods as originating, or manufactured in the territory of a country, or a region or locality in that territory, where a given quality, reputation or other characteristic of such goods is essentially attributable to its geographical origin.
Section 2(1)(k): "producer", in relation to goods, means producer of agricultural goods, person who exploits natural goods, or person who makes/manufactures handicraft or industrial goods.
Section 8: Registration in respect of particular goods and area.
Section 9: Prohibition of registration of certain geographical indications (deceptive, contrary to law, generic names, etc.).""",
    """CHAPTER IV & V: RIGHTS, INFRINGEMENT & TM INTERACTION
Section 21: Rights conferred by registration:
(a) To registered proprietor and authorized user(s) the right to obtain relief in respect of infringement;
(b) To authorized user exclusive right to use GI in relation to goods.
Section 22: Infringement of registered geographical indications:
Use of GI suggesting goods originate in another geographical area misleading the public, or acts of unfair competition/passing off.
Section 24: Prohibition of assignment, transmission, licensing, pledge, or mortgage of GI (GIs are collective public property).
Section 25: Prohibition of registration of geographical indication as a trade mark:
Trade marks containing or consisting of GIs for goods not originating from that region shall be refused or invalidated.

Application to Ayurvedic & Botanical Heritage:
Traditional regional botanicals (e.g. Navara rice, Alleppey Green Cardamom, Malabar Pepper, Darjeeling Tea, Kashmir Saffron) possess distinctive therapeutic terroirs protected under GI legislation to prevent biopiracy and misleading branding."""
]

# India: Designs Act 2000
designs_pages = [
    """THE DESIGNS ACT, 2000 (ACT NO. 16 OF 2000)
CHAPTER I & II: PRELIMINARY & REGISTRATION OF DESIGNS
Section 2(d): "design" means only the features of shape, configuration, pattern, ornament or composition of lines or colours applied to any article whether in two dimensional or three dimensional or in both forms, by any industrial process or means, which in the finished article appeal to and are judged solely by the eye; but does not include any mode or principle of construction or mechanical device, and does not include trade mark or copyright.
Section 4: Prohibition of registration of certain designs:
A design which is not new or original, has been published in India or abroad prior to filing, or is not significantly distinguishable from known designs shall not be registered.
Section 11: Copyright in registered designs:
10 years from registration date, extendable by 5 years (maximum 15 years protection).
Relevance to Ayurveda Startups: Protects novel applicator shapes, ergonomic churners, customized herbal inhalers, dispensers, and distinctive packaging geometries."""
]

# India: Drugs and Magic Remedies Act 1954
dmr_pages = [
    """THE DRUGS AND MAGIC REMEDIES (OBJECTIONABLE ADVERTISEMENTS) ACT, 1954 (ACT NO. 21 OF 1954)
An Act to control the advertisement of drugs in certain cases, to prohibit advertisement of remedies alleged to possess magic qualities.
Section 3: Prohibition of advertisement of certain drugs for treatment of certain diseases:
No person shall take part in publication of any advertisement referring to any drug in terms suggesting its use for:
(a) procurement of miscarriage or prevention of conception;
(b) maintenance or improvement of sexual pleasure;
(c) correction of menstrual disorder;
(d) diagnosis, cure, mitigation, treatment or prevention of any disease/disorder specified in the Schedule (54 listed conditions).
Section 4: Prohibition of misleading advertisements relating to drugs:
No advertisement directly or indirectly giving false impression, false claim, or misleading material particulars.
Section 5: Prohibition of advertisement of magic remedies (talismans, mantras, kavachas claiming miraculous powers).
Section 7: Penalties: Imprisonment up to 6 months for first offence, up to 1 year for subsequent offence.
Schedule Highlights: Includes Cancer, Diabetes, Cataract, Heart diseases, High/low blood pressure, Paralysis, Tuberculosis, Sexual impotence."""
]

print("Building Batch 2 authoritative PDFs...")
build_pdf(data_intl / "convention_on_biological_diversity.pdf", cbd_pages)
build_pdf(ip_intl / "convention_on_biological_diversity.pdf", cbd_pages)

build_pdf(data_india / "drugs_and_cosmetics_act_1940.pdf", dc_pages)
build_pdf(ip_india / "drugs_and_cosmetics_act_1940.pdf", dc_pages)

build_pdf(data_india / "ayurveda_aahar_regulations_2022.pdf", aahar_pages)
build_pdf(ip_india / "ayurveda_aahar_regulations_2022.pdf", aahar_pages)

build_pdf(data_india / "trade_marks_act_1999.pdf", tm_pages)
build_pdf(ip_india / "trade_marks_act_1999.pdf", tm_pages)

build_pdf(data_india / "geographical_indications_of_goods_act_1999.pdf", gi_pages)
build_pdf(ip_india / "geographical_indications_of_goods_act_1999.pdf", gi_pages)

build_pdf(data_india / "designs_act_2000.pdf", designs_pages)
build_pdf(ip_india / "designs_act_2000.pdf", designs_pages)

build_pdf(data_india / "drugs_and_magic_remedies_act_1954.pdf", dmr_pages)
build_pdf(ip_india / "drugs_and_magic_remedies_act_1954.pdf", dmr_pages)

print("Batch 2 completed! All authoritative PDFs generated.")
