import React from 'react';
import { Image, TouchableOpacity, Modal, Text } from 'react-native';

import useStyles from '../styles';

interface FullScreenImageViewProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
  onDelete: () => void;
}

const FullScreenImageView: React.FC<FullScreenImageViewProps> = ({
  visible,
  imageUri,
  onClose,
  onDelete,
}) => {
  const styles = useStyles();

  return (<Modal visible={visible} transparent={false} onRequestClose={onClose}>
    <TouchableOpacity style={styles.fullScreenContainer} onPress={onClose}>
      <Image source={{ uri: imageUri }} style={styles.fullScreenImage} resizeMode="contain" />
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
  );
};

export default FullScreenImageView;