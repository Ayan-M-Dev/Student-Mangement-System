import * as React from 'react';
import { Box, Paper, Tab, Tabs, Stack, Button, Typography, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { TabPanel } from '@/components/tab-panel';
import { PageContentHeader } from '@/components/page-content-header';
import { StudentProfile } from '@/components/user-account-profile';
import { useWallet } from '@/contexts/WalletContext';

const tabs = ['Profile', 'Certificate'];

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ABI = [
  "function issueCertificate(uint256 studentId, string memory dataHash) public",
  "function verifyCertificate(uint256 studentId) public view returns (string memory)"
];

const CertificatePanel = ({ studentId }: { studentId: string }) => {
    const { provider, isConnected } = useWallet();
    const [loading, setLoading] = React.useState(false);

    const handleIssue = async () => {
        if (!provider || !studentId) return;
        setLoading(true);
        try {
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
            const hash = `CERT-${studentId}-${Date.now()}`; 
            const tx = await contract.issueCertificate(BigInt(studentId), hash);
            await tx.wait();
            toast.success(`Success! Certificate Issued. Hash: ${hash}`);
        } catch (err: any) {
            toast.error(`Error: ${err.message}`);
        }
        setLoading(false);
    };

    const handleVerify = async () => {
        if (!provider || !studentId) return;
        setLoading(true);
        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
            const result = await contract.verifyCertificate(BigInt(studentId));
            if (result && result.length > 0) {
                toast.success(`Verified! Certificate Content: ${result}`);
            } else {
                toast.info("No Certificate found for this student.");
            }
        } catch (err: any) {
            toast.error(`Error: ${err.message}`);
        }
        setLoading(false);
    };

    if (!isConnected) return <Alert severity="warning">Please Connect Wallet on Login Page first.</Alert>;

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Blockchain Certificate</Typography>
            
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button variant="contained" onClick={handleIssue} disabled={loading}>
                    Issue Certificate
                </Button>
                <Button variant="outlined" onClick={handleVerify} disabled={loading}>
                    Verify Certificate
                </Button>
            </Stack>

            {loading && <Typography>Processing...</Typography>}
        </Box>
    );
};

export const ViewStudent = () => {
  const { id } = useParams();
  const [tab, setTab] = React.useState(0);

  React.useEffect(() => {
    setTab(0);
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, index: number) => {
    setTab(index);
  };

  return (
    <>
      <PageContentHeader heading='Account Details' />
      <Box component={Paper} sx={{ p: 1 }}>
        <Tabs
          variant='scrollable'
          value={tab}
          onChange={handleTabChange}
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          {tabs.map((tab) => (
            <Tab key={tab} label={tab} />
          ))}
        </Tabs>
        <Box sx={{ display: 'flex', flexGrow: 1 }}>
          <TabPanel value={tab} index={0}>
            <StudentProfile id={id} />
          </TabPanel>
          <TabPanel value={tab} index={1}>
             {id && <CertificatePanel studentId={id} />}
          </TabPanel>
        </Box>
      </Box>
    </>
  );
};
