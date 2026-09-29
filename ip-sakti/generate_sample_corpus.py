"""
Utility to generate authentic legal sample PDFs for IP-SAKTI Sahayak
Covers:
1. Drugs and Cosmetics Act, 1940 (Ayurveda Provisions, Classical vs Proprietary)
2. The Patents Act, 1970 (Section 3(p) Traditional Knowledge Exclusion & TKDL)
3. The Biological Diversity Act, 2002 & 2023 Amendment (Section 6 NBA IPR Approval & ABS)
4. FSSAI Ayurveda-Aahar Regulations, 2022
5. US FDA Botanical Drug Development Guidance
6. EU Directive 2004/24/EC (Traditional Herbal Medicinal Products Directive / THMPD)
"""

import os
from pathlib import Path

def create_pdf(filename: str, pages_content: list[str]):
    objects = []
    
    def add_obj(byte_data: bytes) -> int:
        objects.append(byte_data)
        return len(objects)

    font_id = add_obj(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    
    content_ids = []
    page_ids = []
    
    for page_text in pages_content:
        stream_lines = ["BT", "/F1 10 Tf", "50 740 Td", "14 TL"]
        for raw_line in page_text.split("\n"):
            line = raw_line.strip()
            if not line:
                stream_lines.append("T*")
                continue
            
            # Wrap lines if over 80 characters
            while len(line) > 80:
                split_idx = line[:80].rfind(" ")
                if split_idx == -1 or split_idx < 40:
                    split_idx = 80
                chunk = line[:split_idx]
                line = line[split_idx:].strip()
                escaped_chunk = chunk.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
                stream_lines.append(f"({escaped_chunk}) Tj")
                stream_lines.append("T*")
                
            escaped_line = line.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
            stream_lines.append(f"({escaped_line}) Tj")
            stream_lines.append("T*")
            
        stream_lines.append("ET")
        stream_bytes = "\n".join(stream_lines).encode("latin-1", "replace")
        c_id = add_obj(f"<< /Length {len(stream_bytes)} >>\nstream\n".encode("latin-1") + stream_bytes + b"\nendstream")
        content_ids.append(c_id)

    # Pages container object ID
    pages_obj_id = len(objects) + 1
    for c_id in content_ids:
        p_id = add_obj(f"<< /Type /Page /Parent {pages_obj_id} 0 R /MediaBox [0 0 612 792] /Contents {c_id} 0 R /Resources << /Font << /F1 {font_id} 0 R >> >> >>".encode("latin-1"))
        page_ids.append(p_id)

    kids_refs = " ".join(f"{pid} 0 R" for pid in page_ids)
    pages_id = add_obj(f"<< /Type /Pages /Kids [{kids_refs}] /Count {len(page_ids)} >>".encode("latin-1"))
    catalog_id = add_obj(f"<< /Type /Catalog /Pages {pages_id} 0 R >>".encode("latin-1"))

    with open(filename, "wb") as f:
        f.write(b"%PDF-1.4\n")
        offsets = [0]
        for idx, obj in enumerate(objects):
            offsets.append(f.tell())
            f.write(f"{idx + 1} 0 obj\n".encode("latin-1"))
            f.write(obj)
            f.write(b"\nendobj\n")
            
        startxref = f.tell()
        f.write(b"xref\n")
        f.write(f"0 {len(objects) + 1}\n".encode("latin-1"))
        f.write(b"0000000000 65535 f \n")
        for off in offsets[1:]:
            f.write(f"{off:010d} 00000 n \n".encode("latin-1"))
            
        f.write(b"trailer\n")
        f.write(f"<< /Size {len(objects) + 1} /Root {catalog_id} 0 R >>\n".encode("latin-1"))
        f.write(b"startxref\n")
        f.write(f"{startxref}\n%%EOF\n".encode("latin-1"))

    print(f"Generated: {filename} ({len(pages_content)} pages)")


def main():
    base_dir = Path(__file__).resolve().parent
    india_dir = base_dir / "data" / "india"
    intl_dir = base_dir / "data" / "international"
    
    india_dir.mkdir(parents=True, exist_ok=True)
    intl_dir.mkdir(parents=True, exist_ok=True)

    # 1. India: Drugs and Cosmetics Act, 1940
    p1 = """MINISTRY OF AYUSH / MINISTRY OF HEALTH & FAMILY WELFARE
THE DRUGS AND COSMETICS ACT, 1940 (CHAPTER IVA - AYURVEDIC, SIDDHA AND UNANI DRUGS)
OFFICIAL STATUTORY EXTRACT - JURISDICTION: INDIA

Section 3(a): 'Ayurvedic, Siddha or Unani drug' includes all medicines intended for internal or external use for or in the diagnosis, treatment, mitigation or prevention of disease or disorder in human beings or animals, and manufactured exclusively in accordance with the formulae described in the authoritative books of Ayurvedic, Siddha and Unani systems of medicine, specified in the First Schedule.

The First Schedule lists 54 authoritative classical Ayurvedic texts, including:
- Charaka Samhita
- Sushruta Samhita
- Ashtanga Hridaya / Ashtanga Samgraha
- Sharngadhara Samhita
- Bhavaprakasha
- Sahasrayogam
- Bhaishajya Ratnavali
- Ayurvedic Pharmacopoeia of India (API)

A medicine manufactured strictly adhering to the recipes and processing specified in these First Schedule books is categorized as a 'Classical Ayurvedic Formulation'. Proof of safety and efficacy is recognized ex-officio based on centuries of codified traditional use."""

    p2 = """DRUGS AND COSMETICS ACT, 1940 & RULES 1945 (CONTINUED)
SECTION 3(h) - PATENT OR PROPRIETARY MEDICINES IN AYURVEDA

Section 3(h): 'Patent or Proprietary Medicine' in relation to Ayurvedic, Siddha or Unani systems means a formulation containing only such ingredients mentioned in the formulae of the authoritative books of Ayurveda, Siddha or Unani systems of medicine specified in the First Schedule, but does not include a medicine which is administered by parenteral route and also a formulation which is sold under a name specified in authoritative books.

Key Regulatory Requirements for Proprietary Formulations:
1. Licensing: Must obtain an ASU manufacturing license from the State Licensing Authority (Form 25D).
2. Ingredients: Every active ingredient MUST be cited in an authoritative First Schedule text. Non-classical synthetic chemicals or allopathic actives are strictly prohibited.
3. Safety & Efficacy: Rule 158B requires submission of published literature, safety study reports, or pilot clinical data depending on whether the ingredients are traditionally known or used in novel combinations.
4. Classical vs Proprietary: Classical formulations carry exact classical names and recipes (e.g. Triphala Churna, Chyawanprash). Proprietary formulations carry brand/trademark names and altered dosage forms (e.g., capsules, syrups)."""

    create_pdf(str(india_dir / "drugs_and_cosmetics_act_1940.pdf"), [p1, p2])

    # 2. India: The Patents Act, 1970
    pat_p1 = """OFFICE OF CONTROLLER GENERAL OF PATENTS, DESIGNS AND TRADE MARKS (CGPDTM)
THE PATENTS ACT, 1970 - SECTION 3 INVENTIONS NOT PATENTABLE
GUIDELINES FOR EXAMINATION OF PATENT APPLICATIONS RELATING TO TRADITIONAL KNOWLEDGE

Section 3(p): 'An invention which in effect, is traditional knowledge or which is an aggregation or duplication of known properties of traditionally known component or components' is NOT an invention within the meaning of this Act.

Statutory Principles regarding Ayurvedic Inventions:
1. Exclusion of Codified Formulations: Any formulation directly derived from classical Ayurvedic texts (Charaka, Sushruta, Sahasrayogam, etc.) is non-patentable under Section 3(p).
2. Section 3(d): The mere discovery of a new form of a known substance which does not result in the enhancement of the known efficacy is not patentable.
3. Section 3(e): A substance obtained by a mere admixture resulting only in aggregation of the properties of the components is not patentable.
4. Traditional Knowledge Digital Library (TKDL): Patent examiners routinely cite TKDL to invalidate claims claiming known plants, combinations, or traditional uses (e.g., Turmeric wound healing, Neem fungicidal claims)."""

    pat_p2 = """THE PATENTS ACT, 1970 - CONDITIONS FOR PATENTABILITY OF AYURVEDIC INNOVATIONS

How can an Ayurvedic innovation achieve patent grant in India?
To overcome Section 3(p), 3(d), and 3(e), the applicant must demonstrate:
1. Synergistic Effect: Quantitative data showing that the combination exhibits an unexpected synergistic therapeutic effect far exceeding simple arithmetic aggregation of the individual plant properties (Section 3(e) compliance).
2. Novel Extraction / Phytopharmaceutical: A novel, non-obvious isolation process or novel standardized fraction with distinct pharmacological mechanism not disclosed in classical literature.
3. Novel Formulation Matrix: Innovative targeted delivery systems (e.g., lipid nanoparticles, phytosomes, microencapsulation) demonstrating improved bioavailability or novel pharmacokinetic profiles.
4. Mandatory NBA Approval: Under Section 6 of Biological Diversity Act, no patent application can be filed in India or overseas without prior approval/intimation to National Biodiversity Authority."""

    create_pdf(str(india_dir / "patents_act_1970_section_3p.pdf"), [pat_p1, pat_p2])

    # 3. India: Biological Diversity Act, 2002
    bio_p1 = """NATIONAL BIODIVERSITY AUTHORITY (NBA) - CHENNAI, INDIA
THE BIOLOGICAL DIVERSITY ACT, 2002 & BIOLOGICAL DIVERSITY (AMENDMENT) ACT, 2023
STATUTORY COMPLIANCE FOR INTELLECTUAL PROPERTY & COMMERCIAL UTILIZATION

Section 6(1): No person shall apply for any intellectual property right, by whatever name called, in or outside India for any invention based on any research or information on a biological resource obtained from India without obtaining the prior approval of the National Biodiversity Authority before grant of such IPR.

Key Statutory Mandates:
1. Form 3 Application: Innovators applying for patents based on Indian medicinal plants (e.g., Ashwagandha, Curcuma longa, Bacopa monnieri) must file Form 3 with NBA before patent grant.
2. Timing: Under the 2023 Amendment, for Indian entities, approval/registration must be obtained before the grant of the patent (previously before application).
3. Access and Benefit Sharing (ABS): Innovators commercializing inventions utilizing biological resources must share monetary or non-monetary benefits with local communities and State Biodiversity Boards (SBB).
4. Penalties: Failure to comply with Section 6 constitutes a cognizable and non-bailable offense under Section 55."""

    create_pdf(str(india_dir / "biological_diversity_act_2002.pdf"), [bio_p1])

    # 4. India: Ayurveda-Aahar Regulations, 2022
    aahar_p1 = """FOOD SAFETY AND STANDARDS AUTHORITY OF INDIA (FSSAI)
FOOD SAFETY AND STANDARDS (AYURVEDA AAHAR) REGULATIONS, 2022
GAZETTE NOTIFICATION CG-DL-E-09052022-235639

Regulation 3 - Definition of Ayurveda Aahar:
'Ayurveda Aahar' means food prepared in accordance with the recipes or books or systems of Ayurveda described in the authoritative books listed under Schedule A of these regulations. It does not include Ayurvedic drugs, cosmetics, or narcotic/psychotropic substances.

Regulatory Boundaries:
1. Therapeutic Claims Prohibited: Products registered as Ayurveda-Aahar CANNOT make disease prevention, treatment, or cure claims. Only general wellness, nutritional, and physiological maintenance claims are permitted.
2. Mandatory Logo: Every package of Ayurveda-Aahar must prominently display the official 'Ayurveda Aahar' logo on the principal display panel.
3. Label Advisory: Must clearly print 'NOT FOR MEDICINAL USE'.
4. Distinction from Drugs: If therapeutic cures (e.g. for diabetes, arthritis, cancer) are claimed, the product is reclassified as an ASU Drug under Drugs & Cosmetics Act and FSSAI license is revoked."""

    create_pdf(str(india_dir / "ayurveda_aahar_regulations_2022.pdf"), [aahar_p1])

    # 5. International: US FDA Botanical Guidance
    fda_p1 = """US FOOD AND DRUG ADMINISTRATION (FDA) - CDER
GUIDANCE FOR INDUSTRY: BOTANICAL DRUG DEVELOPMENT (REVISED JUNE 2016)
JURISDICTION: UNITED STATES / INTERNATIONAL

Regulatory Classification of Ayurvedic Products in the United States:
In the US, Ayurvedic formulations are primarily marketed under two pathways:
1. Dietary Supplements (under Dietary Supplement Health and Education Act - DSHEA 1994):
   - Marketed for nutritional support without pre-market FDA approval.
   - CANNOT claim to diagnose, treat, cure, or prevent any disease.
   - May carry structure/function claims (with mandatory FDA disclaimer).
   - If using a new botanical ingredient not marketed before Oct 15, 1994, a New Dietary Ingredient (NDI) notification must be submitted 75 days prior.

2. Botanical Drugs (IND/NDA Pathway):
   - Products intended for therapeutic treatment of diseases.
   - Must undergo clinical trials under an Investigational New Drug (IND) and New Drug Application (NDA).
   - Chemistry, Manufacturing, and Controls (CMC): Batch-to-batch consistency must be verified using spectroscopic fingerprinting and biological assays, recognizing that botanicals have complex heterogeneous multi-chemical compositions."""

    create_pdf(str(intl_dir / "fda_botanical_drug_guidance.pdf"), [fda_p1])

    # 6. International: EU THMPD Directive 2004/24/EC
    eu_p1 = """EUROPEAN MEDICINES AGENCY (EMA) - COMMITTEE ON HERBAL MEDICINAL PRODUCTS (HMPC)
DIRECTIVE 2004/24/EC ON TRADITIONAL HERBAL MEDICINAL PRODUCTS (THMPD)
JURISDICTION: EUROPEAN UNION / INTERNATIONAL REGIMES

Three Regulatory Pathways for Herbal / Ayurvedic Formulations in the European Union:

1. Traditional Herbal Medicinal Product (THMPD - Simplified Registration):
   - Applies to herbal medicines with long-standing safety and plausible efficacy.
   - Crucial Requirement: The applicant must demonstrate at least 30 years of continuous traditional medicinal use, of which AT LEAST 15 YEARS must be within the European Community / European Union.
   - Challenge for Indian Ayurveda: Classical Ayurvedic formulations with thousands of years of use in India often fail the 15-year EU usage requirement unless historical trade or EU clinical presence is documented.

2. Well-Established Use (WEU):
   - Full marketing authorization based on bibliographic scientific evidence.
   - Requires recognized efficacy and acceptable level of safety demonstrated through published scientific literature over at least 10 years within the EU.

3. Food Supplements:
   - Governed under Food Supplements Directive 2002/46/EC.
   - Cannot make therapeutic claims; only EFSA-approved botanical health claims allowed."""

    create_pdf(str(intl_dir / "eu_directive_2004_24_thmpd.pdf"), [eu_p1])

    print("\nAuthoritative sample legal corpus generated successfully!")

if __name__ == "__main__":
    main()
