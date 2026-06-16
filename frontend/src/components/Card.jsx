import { memo } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

const PropostaCard = memo(function PropostaCard({ item }) {
  return (
    <Card sx={{ width: 340, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Chip label={item.sigla_tipo} color="primary" size="small" />
          <Typography variant="body2" color="text.secondary">
            Nº {item.numero} — {item.ano}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
          {item.ementa}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Apresentado em:{' '}
          {new Date(item.data_apresentacao).toLocaleDateString('pt-BR')}
        </Typography>
        {item.uri && (
          <Box sx={{ mt: 1 }}>
            <a href={item.uri} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>
              Ver detalhes
            </a>
          </Box>
        )}
      </CardContent>
    </Card>
  );
});

export default PropostaCard;
